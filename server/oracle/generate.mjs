// @ts-nocheck
import {
  activeCourseIds,
  authMode,
  hasPremium,
  json,
  promoActive,
  promoUntilDate,
  readDailyUsage,
  readSeen,
  recordFreeUsage,
  recordPaidUsage,
  writeSeen,
} from "./account.mjs";
import { CHUNK_MAX, COURSES, FREE_COURSES_DAILY, FREE_DAILY, PAID_TEST_MAX } from "./courses.mjs";
import { callDeepSeek, buildPrompt } from "./deepseek.mjs";
import { isFresh, labelQuestion, pickLocalQuestions, similarPrompt } from "./questions.mjs";

function shuffleOptions(question) {
  const order = question.options.map((_, index) => index);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return {
    ...question,
    options: order.map((index) => question.options[index]),
    answer: order.indexOf(question.answer),
  };
}

function acceptQuestions(parsed, topics, avoid, limit) {
  const seen = new Set((avoid || []).map((item) => String(item).toLowerCase()));
  const accepted = [];
  for (const question of Array.isArray(parsed?.questions) ? parsed.questions : []) {
    if (!question || typeof question.prompt !== "string" || !question.prompt.trim()) continue;
    if (!topics.includes(question.topic)) continue;
    if (!Array.isArray(question.options) || question.options.length !== 4) continue;
    if (!question.options.every((option) => typeof option === "string" && option.trim())) continue;
    if (new Set(question.options.map((option) => option.trim().toLowerCase())).size !== 4) continue;
    if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) continue;
    if (
      !Array.isArray(question.steps) ||
      question.steps.length < 1 ||
      !question.steps.every((step) => typeof step === "string" && step.trim())
    ) {
      continue;
    }
    if (!isFresh(question.prompt, avoid) || seen.has(question.prompt.trim().toLowerCase())) continue;
    if ((avoid || []).some((item) => similarPrompt(question.prompt, item))) continue;
    seen.add(question.prompt.trim().toLowerCase());
    accepted.push(
      labelQuestion({
        topic: question.topic,
        prompt: question.prompt.trim(),
        options: question.options.map((option) => option.trim()),
        answer: question.answer,
        steps: question.steps.map((step) => step.trim()),
        origin: "oracle",
      }),
    );
    if (accepted.length >= limit) break;
  }
  return accepted;
}

function withSource(questions, course) {
  return questions.map((question) => ({
    ...shuffleOptions(labelQuestion(question)),
    course,
  }));
}

export async function handleGenerate(req, user) {
  const paidByPromo = promoActive();
  let paid = paidByPromo;
  if (!paid && user && !user.local) {
    try {
      paid = await hasPremium(user.uid);
    } catch (error) {
      console.error("Premium entitlement lookup failed", error?.message);
      return json(503, { error: "Account access could not be checked. Please try again." });
    }
  } else if (!paid && user?.local) {
    paid = await hasPremium(user.uid);
  }

  if (req.method === "GET") {
    const used = user ? await readDailyUsage(user.uid) : {};
    return json(200, {
      paid: paid || paidByPromo,
      sitewidePremium: paidByPromo,
      promoUntil: promoUntilDate(),
      promoActive: paidByPromo,
      authMode: authMode(),
      freeDaily: FREE_DAILY,
      freeCoursesDaily: FREE_COURSES_DAILY,
      subjectsUsed: activeCourseIds(used).length,
      maxPerTest: PAID_TEST_MAX,
      welcomeTestAvailable: false,
      used,
      courses: Object.entries(COURSES).map(([id, course]) => ({
        id,
        label: course.label,
        name: course.name,
        topics: course.topics,
        grounded: course.grounded,
      })),
    });
  }

  if (req.method !== "POST") return json(405, { error: "Use POST to request questions." });
  if (!user) {
    return json(401, {
      code: "auth_required",
      error: "Sign in to your account before starting a test.",
    });
  }

  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: "Request body must be valid JSON." });
  }

  const cfg = COURSES[input.course];
  const topics = Array.isArray(input.topics)
    ? input.topics.filter((topic) => cfg?.topics.includes(topic))
    : [];
  const count = Number(input.count);
  if (!cfg || !topics.length || !Number.isInteger(count) || count < 1 || count > CHUNK_MAX) {
    return json(400, {
      error: `Choose a course, at least one topic, and 1 to ${CHUNK_MAX} questions per request.`,
    });
  }

  let dailyUsage = {};
  let used = 0;
  let allowed = count;
  if (!paid) {
    dailyUsage = await readDailyUsage(user.uid);
    used = dailyUsage[input.course] || 0;
    if (used >= FREE_DAILY) {
      return json(429, {
        code: "quota",
        used,
        error: `You've used your ${FREE_DAILY} free ${input.course} questions for today. Come back tomorrow or upgrade for unlimited practice.`,
      });
    }
    if (!dailyUsage[input.course] && activeCourseIds(dailyUsage).length >= FREE_COURSES_DAILY) {
      return json(429, {
        code: "subject_limit",
        subjectsUsed: activeCourseIds(dailyUsage).length,
        error: `You've used all ${FREE_COURSES_DAILY} free courses for today. Upgrade or come back tomorrow.`,
      });
    }
    allowed = Math.min(count, FREE_DAILY - used);
  }

  const clientAvoid = Array.isArray(input.avoid)
    ? input.avoid.filter((item) => typeof item === "string").slice(0, 24).map((item) => item.slice(0, 140))
    : [];
  const remembered = await readSeen(user.uid);
  const avoid = [...clientAvoid, ...remembered].slice(-40);
  const batch = Number.isInteger(input.batch) ? input.batch : 0;

  let questions = [];
  let fallback = false;
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (apiKey) {
    try {
      const result = await callDeepSeek(
        apiKey,
        buildPrompt({ course: input.course, cfg, topics, count: allowed, avoid, batch }),
      );
      if (result.parsed) {
        questions = acceptQuestions(result.parsed, topics, avoid, allowed);
      } else {
        console.error("DeepSeek unavailable", result.error);
        fallback = true;
      }
    } catch (error) {
      console.error("Question generation failed", error?.message);
      fallback = true;
    }
  } else {
    fallback = true;
  }

  if (questions.length < allowed) {
    fallback = questions.length === 0 || fallback;
    const local = pickLocalQuestions({
      course: input.course,
      topics,
      count: allowed - questions.length,
      avoid: [...avoid, ...questions.map((question) => question.prompt)],
      batch,
      salt: `${user.uid}:${Date.now()}`,
    });
    questions = questions.concat(local);
  }

  if (!questions.length) {
    return json(502, {
      code: "empty",
      error: "Oracle couldn't write a usable set. Please try again.",
    });
  }

  questions = withSource(questions.slice(0, allowed), input.course);
  await writeSeen(
    user.uid,
    questions.map((question) => question.prompt),
  );

  if (!paid) {
    const usage = await recordFreeUsage(
      user.uid,
      input.course,
      questions.length,
      FREE_DAILY,
      FREE_COURSES_DAILY,
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
  } else if (user && !paidByPromo) {
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
    fallback,
    subjectsUsed: paid ? undefined : activeCourseIds(dailyUsage).length,
  });
}
