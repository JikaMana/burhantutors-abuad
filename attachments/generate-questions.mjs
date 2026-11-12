import { FieldValue } from "firebase-admin/firestore";
import {
  authenticatedUser,
  firebaseServices,
  hasPremium,
  originAllowed,
} from "./lib/account.mjs";

// ---- Courses (edit here to add topics or paste past-question text) ----
// Single source of truth for every course the Oracle supports.
// To ground a course in its real past questions, paste the legible text of the PDF
// into `source` (keep it under ~6 KB) and set `grounded: true`.

const GENERIC_RULES = `No past-question PDF has been loaded for this course yet. Write questions from the standard first-year (100-level) university syllabus for the course and topics named. Keep them at the difficulty of Nigerian university CBT exams. Do not claim they are past questions.`;

export const COURSES = {
  "MTH 101": {
    label: "MTH 101",
    name: "Mathematics",
    grounded: true,
    topics: [
      "Complex numbers",
      "Sequences and series",
      "Quadratic equations",
      "Sets",
      "Matrices",
      "Number systems",
    ],
    source: `ABUAD MTH 101 Holiday Assignment (PDF: PDFs/final_pq.pdf)

Topics and question patterns present in the supplied document:
- Complex numbers: operations, real and imaginary parts, roots of quadratics in a+bi form, and powers of roots.
- Arithmetic and geometric progressions: sums, terms, common difference and ratio; an infinite halving series.
- Quadratic equations: roots, completing the square, equal-root/discriminant conditions, and equations formed from transformed roots.
- Sets: symmetric difference, complements, unions, intersections, cardinality and power sets.
- Matrices: operations involving given matrices.
- Number systems and sequences: integers/natural numbers, consecutive integers, and sums of even numbers.

Legible examples include: z1=7+3i, z2=4-2i, z3=1+i; roots of x^2-4x-6=0; solve x^2-x+1=0 and show its roots satisfy x^3=-1; a six-term GP with first term 192 and ratio 1.5; a 21-term AP with common difference 1.5; sets in the positive integers up to 30; matrix expression 3(A+B)-2A; sum of even numbers between 99 and 999; five consecutive integers summing to 100; and repeated halving of N100.

The source PDF has over 26 pages but only about 5 KB of selectable text. Do not claim generated questions are verbatim past questions. Do not infer unreadable details. Write fresh, solvable practice questions from the legible topics above.`,
  },
  "MTH 103": {
    label: "MTH 103",
    name: "Mathematics",
    grounded: false,
    topics: [
      "Functions and graphs",
      "Limits and continuity",
      "Differentiation",
      "Integration",
      "Trigonometry",
      "Coordinate geometry",
    ],
    source: GENERIC_RULES,
  },
  "PHY 101": {
    label: "PHY 101",
    name: "Physics",
    grounded: false,
    topics: [
      "Units and dimensions",
      "Kinematics",
      "Newton's laws",
      "Work, energy and power",
      "Momentum and collisions",
      "Circular motion and gravitation",
    ],
    source: GENERIC_RULES,
  },
  "PHY 103": {
    label: "PHY 103",
    name: "Physics",
    grounded: false,
    topics: [
      "Electric charge and fields",
      "Electric potential",
      "Capacitors",
      "Current and resistance",
      "Magnetism",
      "Waves and optics",
    ],
    source: GENERIC_RULES,
  },
  STAT: {
    label: "STAT",
    name: "Statistics",
    grounded: false,
    topics: [
      "Descriptive statistics",
      "Probability",
      "Random variables",
      "Binomial and Poisson",
      "Normal distribution",
      "Correlation and regression",
    ],
    source: GENERIC_RULES,
  },
  "CHM 101": {
    label: "CHM 101",
    name: "Chemistry",
    grounded: false,
    topics: [
      "Atomic structure",
      "Periodic table",
      "Chemical bonding",
      "Mole concept and stoichiometry",
      "Gases",
      "Acids, bases and pH",
    ],
    source: GENERIC_RULES,
  },
  "BIO 101": {
    label: "BIO 101",
    name: "Biology",
    grounded: false,
    topics: [
      "Cell biology",
      "Genetics",
      "Classification of organisms",
      "Ecology",
      "Nutrition and digestion",
      "Reproduction and evolution",
    ],
    source: GENERIC_RULES,
  },
};

// ---- Limits ---------------------------------------------------------------
const CHUNK_MAX = 3; // smaller batches reduce generation latency and timeout risk
const FREE_DAILY = 10; // free questions per course per day
const FREE_COURSES_DAILY = 3; // distinct courses per visitor per day
const PAID_TEST_MAX = 60; // enforced client-side per test; server just limits chunks
const SITEWIDE_PREMIUM = false; // set true to grant premium to everyone until toggled off
const WELCOME_TEST_QUESTIONS = 2;
const TIME_BUDGET_MS = Number(process.env.FUNCTION_BUDGET_MS) || 8000;
const MODEL_TIMEOUT_MS = Number(process.env.GEMINI_MODEL_TIMEOUT_MS) || 4500;

// Aliases always point at the current Flash models, so a retired model name
// can no longer break the app. Override with GEMINI_MODELS="a,b" in Netlify.
const MODELS = (
  process.env.GEMINI_MODELS || "gemini-flash-latest,gemini-flash-lite-latest"
)
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

// ---- Helpers --------------------------------------------------------------
const lagosDay = () =>
  new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 10);

async function recordPaidUsage(user, course, questionCount) {
  if (!user || questionCount < 1) return;
  const { db } = firebaseServices();
  const day = lagosDay();
  await db
    .collection("oracleUsers")
    .doc(user.uid)
    .set(
      {
        email: user.email || null,
        usage: {
          paidQuestionsTotal: FieldValue.increment(questionCount),
          paidQuestionsByDay: { [day]: FieldValue.increment(questionCount) },
          paidQuestionsByCourse: {
            [course]: FieldValue.increment(questionCount),
          },
          lastPaidPracticeAt: FieldValue.serverTimestamp(),
        },
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
}

export function activeCourseIds(used) {
  return Object.keys(used).filter((course) => used[course] > 0);
}

export function isNewCourseBlocked(used, course, limit = FREE_COURSES_DAILY) {
  return !used[course] && activeCourseIds(used).length >= limit;
}

async function readDailyUsage(uid) {
  if (!uid) return {};
  const { db } = firebaseServices();
  const snapshot = await db
    .collection("oracleUsers")
    .doc(uid)
    .collection("dailyUsage")
    .doc(lagosDay())
    .get();
  return snapshot.get("courses") || {};
}

async function recordFreeUsage(uid, course, count) {
  const { db } = firebaseServices();
  const dailyRef = db
    .collection("oracleUsers")
    .doc(uid)
    .collection("dailyUsage")
    .doc(lagosDay());
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(dailyRef);
    const used = snapshot.get("courses") || {};
    const current = Number(used[course]) || 0;
    if (current + count > FREE_DAILY) {
      return { allowed: false, code: "quota", used: current };
    }
    if (isNewCourseBlocked(used, course)) {
      return {
        allowed: false,
        code: "subject_limit",
        subjectsUsed: activeCourseIds(used).length,
      };
    }
    const next = current + count;
    const courses = { ...used, [course]: next };
    transaction.set(
      dailyRef,
      { courses, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    return {
      allowed: true,
      used: next,
      subjectsUsed: activeCourseIds(courses).length,
    };
  });
}

async function claimWelcomeTest(uid) {
  const { db } = firebaseServices();
  const userRef = db.collection("oracleUsers").doc(uid);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (snapshot.get("welcomeTestUsed")) return false;
    transaction.set(
      userRef,
      {
        welcomeTestUsed: true,
        lastActivityAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  });
}

function shuffleOptions(q) {
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    answer: order.indexOf(q.answer),
  };
}

function parseModelJson(text) {
  const cleaned = String(text || "")
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  return JSON.parse(cleaned);
}

// ---- Gemini ---------------------------------------------------------------
const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    questions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          topic: { type: "STRING" },
          prompt: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" } },
          answer: { type: "INTEGER" },
          steps: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["topic", "prompt", "options", "answer", "steps"],
      },
    },
  },
  required: ["questions"],
};

async function callGemini(apiKey, prompt) {
  const deadline = Date.now() + TIME_BUDGET_MS;
  let last = { status: 502 };

  for (const model of MODELS) {
    const left = deadline - Date.now();
    if (left < 2500) break;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          signal: AbortSignal.timeout(Math.min(left, MODEL_TIMEOUT_MS)),
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: RESPONSE_SCHEMA,
              temperature: 0.7,
              // Generous on purpose: "thinking" models spend output tokens on
              // reasoning first, and a low cap truncates the JSON mid-way.
              maxOutputTokens: 8192,
            },
          }),
        },
      );
      if (res.ok) {
        const data = await res.json();
        const text = (data.candidates?.[0]?.content?.parts || [])
          .map((p) => p.text || "")
          .join("");
        if (text) return { text, model };
        last = { status: 502, message: "Empty response" };
        continue;
      }
      const err = await res.json().catch(() => ({}));
      last = {
        status: res.status,
        message: err?.error?.message || err?.error?.status || "unknown",
      };
      console.error("Gemini error", {
        model,
        status: res.status,
        message: String(last.message).slice(0, 400),
      });
      // 404 = bad model name, 429 = rate limited, 5xx = provider trouble: try the next model.
      // 400/401/403 are config problems a fallback model cannot fix.
      if (![404, 429, 500, 503].includes(res.status)) break;
    } catch (e) {
      console.error("Gemini fetch failed", {
        model,
        name: e?.name,
        message: e?.message,
      });
      last = {
        status:
          e?.name === "TimeoutError" || e?.name === "AbortError" ? 504 : 502,
      };
      if (last.status === 504 && Date.now() >= deadline - 2500) break;
    }
  }
  return { error: last };
}

function buildPrompt({ course, cfg, topics, count, avoid, batch }) {
  const avoidBlock = avoid.length
    ? `\nDo NOT repeat or closely paraphrase these questions already asked:\n${avoid.map((a) => `- ${a}`).join("\n")}\n`
    : "";
  return `You write practice questions for ABUAD (Afe Babalola University) ${course} (${cfg.name}), in the style of Nigerian university computer-based tests (CBT).

Write exactly ${count} multiple-choice questions on these topics only: ${topics.join("; ")}.
Rules:
- Exactly 4 options. Exactly one is correct. "answer" is the zero-based index (0 to 3) of the correct option.
- Wrong options must be plausible (typical student mistakes), never silly.
- Mix recall, short calculation and "spot the trap" items. Vary difficulty. This is set #${batch + 1}, so choose fresh numbers and angles.
- Solve every question yourself and verify the answer before returning it. If you cannot make a reliable question, write an easier one.
- Plain text only. No LaTeX, no markdown, no $ signs. Write maths as x^2, sqrt(x), a/b, 3 + 4i, and use symbols like x, ≤, ≥, π where helpful.
- "steps": 2 to 5 short strings showing the working.
- "topic" must be copied exactly from the topic list above.
${avoidBlock}
SOURCE MATERIAL:
${cfg.source}`;
}

// ---- Handler --------------------------------------------------------------
export default async function handler(req, context) {
  let user = null;
  if (req.headers.has("authorization")) {
    try {
      user = await authenticatedUser(req, false);
    } catch {
      return json(401, {
        code: "auth_required",
        error: "Your sign-in has expired. Please sign in again.",
      });
    }
  }
  let paid = SITEWIDE_PREMIUM;
  if (!paid && user) {
    try {
      paid = await hasPremium(user.uid);
    } catch (error) {
      console.error("Premium entitlement lookup failed", error?.message);
      return json(503, {
        error: "Account access could not be checked. Please try again.",
      });
    }
  }
  if (req.method === "GET") {
    const used = await readDailyUsage(user?.uid);
    let welcomeTestAvailable = true;
    if (user) {
      const { db } = firebaseServices();
      const account = await db.collection("oracleUsers").doc(user.uid).get();
      welcomeTestAvailable = !account.get("welcomeTestUsed");
    }
    return json(200, {
      paid,
      sitewidePremium: SITEWIDE_PREMIUM,
      freeDaily: FREE_DAILY,
      freeCoursesDaily: FREE_COURSES_DAILY,
      subjectsUsed: activeCourseIds(used).length,
      maxPerTest: PAID_TEST_MAX,
      welcomeTestAvailable,
      used,
      courses: Object.entries(COURSES).map(([id, c]) => ({
        id,
        label: c.label,
        name: c.name,
        topics: c.topics,
        grounded: c.grounded,
      })),
    });
  }

  if (req.method !== "POST")
    return json(405, { error: "Use POST to request questions." });
  if (!originAllowed(req))
    return json(403, { error: "Request origin is not allowed." });
  if (!user)
    return json(401, {
      code: "auth_required",
      error: "Sign in to your account before starting a test.",
    });

  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: "Request body must be valid JSON." });
  }

  const cfg = COURSES[input.course];
  const topics = Array.isArray(input.topics)
    ? input.topics.filter((t) => cfg?.topics.includes(t))
    : [];
  const count = Number(input.count);
  const welcomeTest = input.welcomeTest === true;
  if (
    !cfg ||
    !topics.length ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > CHUNK_MAX ||
    (welcomeTest && count > WELCOME_TEST_QUESTIONS)
  ) {
    return json(400, {
      error: `Choose a course, at least one topic, and 1 to ${CHUNK_MAX} questions per request.`,
    });
  }

  // Free quotas are per account and reset at midnight Lagos time.
  let dailyUsage = {};
  let used = 0;
  let allowed = count;
  if (!paid && !welcomeTest) {
    dailyUsage = await readDailyUsage(user.uid);
    used = dailyUsage[input.course] || 0;
    if (used >= FREE_DAILY) {
      return json(429, {
        code: "quota",
        used,
        error: `You've used your ${FREE_DAILY} free ${input.course} questions for today. Come back tomorrow or upgrade for unlimited practice.`,
      });
    }
    if (isNewCourseBlocked(dailyUsage, input.course)) {
      return json(429, {
        code: "subject_limit",
        subjectsUsed: activeCourseIds(dailyUsage).length,
        error: `You've used all ${FREE_COURSES_DAILY} free courses for today. Upgrade or come back tomorrow.`,
      });
    }
    allowed = Math.min(count, FREE_DAILY - used);
  }
  if (welcomeTest && count !== WELCOME_TEST_QUESTIONS) {
    return json(400, {
      error: `The welcome test must contain ${WELCOME_TEST_QUESTIONS} questions.`,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return json(503, {
      code: "config",
      error: "Exam Oracle is being set up. Please try again shortly.",
    });

  const avoid = Array.isArray(input.avoid)
    ? input.avoid
        .filter((a) => typeof a === "string")
        .slice(0, 15)
        .map((a) => a.slice(0, 110))
    : [];
  const batch = Number.isInteger(input.batch) ? input.batch : 0;

  const result = await callGemini(
    apiKey,
    buildPrompt({
      course: input.course,
      cfg,
      topics,
      count: allowed,
      avoid,
      batch,
    }),
  );
  if (result.error) {
    const s = result.error.status;
    if (s === 429 || s === 503)
      return json(429, {
        code: "capacity",
        error: "The question engine is busy. Please retry shortly.",
        providerStatus: s,
      });
    if (s === 504)
      return json(504, {
        code: "timeout",
        error: "Oracle is taking longer than usual.",
        providerStatus: s,
      });
    return json(502, {
      code: "provider",
      error: "Oracle couldn't create questions right now.",
      providerStatus: s,
    });
  }

  let parsed;
  try {
    parsed = parseModelJson(result.text);
  } catch {
    console.error("Unparseable model JSON", result.text.slice(0, 200));
    return json(502, {
      code: "parse",
      error: "Oracle returned an unreadable set. Retrying…",
    });
  }

  const seen = new Set(avoid.map((a) => a.toLowerCase()));
  const questions = (Array.isArray(parsed.questions) ? parsed.questions : [])
    .filter((q) => {
      if (!q || typeof q.prompt !== "string" || !q.prompt.trim()) return false;
      if (!topics.includes(q.topic)) return false;
      if (!Array.isArray(q.options) || q.options.length !== 4) return false;
      if (!q.options.every((o) => typeof o === "string" && o.trim()))
        return false;
      if (new Set(q.options.map((o) => o.trim().toLowerCase())).size !== 4)
        return false;
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3)
        return false;
      if (
        !Array.isArray(q.steps) ||
        !q.steps.length ||
        !q.steps.every((s) => typeof s === "string")
      )
        return false;
      const sig = q.prompt.trim().slice(0, 110).toLowerCase();
      if (seen.has(sig)) return false;
      seen.add(sig);
      return true;
    })
    .slice(0, allowed)
    .map((q) => ({
      ...shuffleOptions(q),
      course: input.course,
      source: cfg.grounded
        ? "Practice question based on the supplied MTH 101 assignment"
        : "AI practice question (standard syllabus)",
    }));

  if (!questions.length)
    return json(502, {
      code: "empty",
      error: "Oracle couldn't write a valid set. Retrying…",
    });

  if (welcomeTest) {
    if (!(await claimWelcomeTest(user.uid))) {
      return json(429, {
        code: "welcome_test_used",
        error: "Your free question welcome test has already been used.",
      });
    }
  } else if (!paid) {
    const usage = await recordFreeUsage(
      user.uid,
      input.course,
      questions.length,
    );
    if (!usage.allowed) {
      return json(429, {
        code: usage.code,
        used: usage.used,
        subjectsUsed: usage.subjectsUsed,
        error:
          usage.code === "quota"
            ? `You've used your ${FREE_DAILY} free ${input.course} questions for today. Come back tomorrow or upgrade for unlimited practice.`
            : `You've used all ${FREE_COURSES_DAILY} free courses for today. Upgrade or come back tomorrow.`,
      });
    }
    used = usage.used;
    dailyUsage[input.course] = used;
  } else if (user && !SITEWIDE_PREMIUM) {
    try {
      await recordPaidUsage(user, input.course, questions.length);
    } catch (error) {
      console.error("Paid usage record failed", error?.message);
    }
  }
  return json(200, {
    questions,
    used,
    paid,
    welcomeTest,
    subjectsUsed: paid ? undefined : activeCourseIds(dailyUsage).length,
  });
}
