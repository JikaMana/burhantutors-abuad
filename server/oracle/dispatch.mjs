// @ts-nocheck
import {
  authenticatedUser,
  handlePaystackWebhook,
  initializePayment,
  json,
  originAllowed,
  readProfile,
  saveActivity,
  verifyPayment,
} from "./account.mjs";
import { handleGenerate } from "./generate.mjs";

function cleanString(value, max) {
  return typeof value === "string" ? value.slice(0, max) : "";
}

function normaliseHistory(input) {
  const course = cleanString(input.course, 40);
  const topics = Array.isArray(input.topics)
    ? input.topics
        .filter((topic) => typeof topic === "string")
        .slice(0, 20)
        .map((topic) => topic.slice(0, 80))
    : [];
  const total = Number(input.total);
  const correct = Number(input.correct);
  const action = typeof input.action === "string" ? input.action : "complete";
  const testId =
    typeof input.id === "number" && Number.isSafeInteger(input.id) ? String(input.id) : "";
  const topicResults = Array.isArray(input.topicResults)
    ? input.topicResults
        .filter((topic) => topic && typeof topic.name === "string")
        .slice(0, 20)
        .map((topic) => ({
          name: topic.name.slice(0, 80),
          correct: Math.max(0, Math.min(Number(topic.correct) || 0, 60)),
          total: Math.max(0, Math.min(Number(topic.total) || 0, 60)),
        }))
    : [];
  const answers = Array.isArray(input.answers)
    ? input.answers.slice(0, 60).map((answer) => ({
        topic: cleanString(answer?.topic, 80),
        prompt: cleanString(answer?.prompt, 2000),
        options: Array.isArray(answer?.options)
          ? answer.options
              .filter((option) => typeof option === "string")
              .slice(0, 4)
              .map((option) => option.slice(0, 500))
          : [],
        selected: Math.max(0, Math.min(Number(answer?.selected) || 0, 3)),
        correctAnswer: Math.max(0, Math.min(Number(answer?.correctAnswer) || 0, 3)),
        correct: answer?.correct === true,
      }))
    : [];
  return { course, topics, total, correct, action, testId, topicResults, answers, raw: input };
}

async function history(req, user) {
  if (req.method === "GET") {
    const profile = await readProfile(user.uid);
    return json(200, profile);
  }
  if (req.method !== "POST") return json(405, { error: "Use GET or POST." });
  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: "Request body must be valid JSON." });
  }
  const activity = normaliseHistory(input);
  if (!activity.course || !activity.testId) {
    return json(400, { error: "Test activity is invalid." });
  }
  if (activity.action === "start") {
    if (!Number.isInteger(activity.total) || activity.total < 1 || activity.total > 60) {
      return json(400, { error: "Test setup is invalid." });
    }
  } else if (activity.action === "answer") {
    const index = Number(input.index);
    const answer = input.answer && typeof input.answer === "object" ? input.answer : {};
    if (!Number.isInteger(index) || index < 0 || index >= 60) {
      return json(400, { error: "Answer activity is invalid." });
    }
    activity.index = index;
    activity.answer = {
      topic: cleanString(answer.topic, 80),
      prompt: cleanString(answer.prompt, 2000),
      options: Array.isArray(answer.options)
        ? answer.options.filter((option) => typeof option === "string").slice(0, 4).map((option) => option.slice(0, 500))
        : [],
      selected: Math.max(0, Math.min(Number(answer.selected) || 0, 3)),
      correctAnswer: Math.max(0, Math.min(Number(answer.correctAnswer) || 0, 3)),
      correct: answer.correct === true,
    };
    if (!activity.answer.prompt || activity.answer.options.length !== 4) {
      return json(400, { error: "Answer activity is invalid." });
    }
  } else if (activity.action === "solution") {
    const index = Number(input.index);
    if (!Number.isInteger(index) || index < 0 || index >= 60) {
      return json(400, { error: "Solution activity is invalid." });
    }
    activity.index = index;
    activity.topic = cleanString(input.topic, 80);
  } else if (activity.action === "abandon") {
    /* status update only */
  } else if (activity.action === "complete") {
    if (
      !Number.isInteger(activity.total) ||
      activity.total < 1 ||
      activity.total > 60 ||
      !Number.isInteger(activity.correct) ||
      activity.correct < 0 ||
      activity.correct > activity.total
    ) {
      return json(400, { error: "Test summary is invalid." });
    }
  } else {
    return json(400, { error: "Test activity is invalid." });
  }
  const saved = await saveActivity(user, {
    id: activity.testId,
    course: activity.course,
    topics: activity.topics,
    total: activity.total,
    correct: activity.correct,
    action: activity.action,
    index: activity.index,
    answer: activity.answer,
    topic: activity.topic,
    topicResults: activity.topicResults,
    answers: activity.answers,
  });
  return json(saved.status, { saved: true, id: saved.id });
}

export async function dispatchOracle(name, req) {
  if (name === "paystack-webhook") {
    if (req.method !== "POST") return new Response("Method not allowed.", { status: 405 });
    return handlePaystackWebhook(req);
  }

  if (req.method !== "GET" && !originAllowed(req)) {
    return json(403, { error: "Request origin is not allowed." });
  }

  if (name === "generate-questions") {
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
    if (req.method !== "GET" && !originAllowed(req)) {
      return json(403, { error: "Request origin is not allowed." });
    }
    return handleGenerate(req, user);
  }

  let user;
  try {
    user = await authenticatedUser(req);
  } catch {
    return json(401, { error: "Please sign in again." });
  }
  if (!user) return json(401, { error: "Sign in to continue." });

  if (name === "test-history") return history(req, user);

  if (name === "paystack-initialize") {
    if (req.method !== "POST") return json(405, { error: "Use POST." });
    try {
      return await initializePayment(user, req);
    } catch (error) {
      console.error("Paystack initialization error", error?.message);
      return json(502, { error: "Could not reach Paystack. Please try again." });
    }
  }

  if (name === "paystack-verify") {
    if (req.method !== "POST") return json(405, { error: "Use POST." });
    let reference;
    try {
      reference = (await req.json()).reference;
    } catch {
      return json(400, { error: "Payment reference is missing." });
    }
    if (typeof reference !== "string" || !/^[\w-]{8,100}$/.test(reference)) {
      return json(400, { error: "Payment reference is invalid." });
    }
    try {
      return await verifyPayment(user, reference);
    } catch (error) {
      console.error("Paystack verification error", error?.message);
      return json(502, { error: "Could not verify payment right now." });
    }
  }

  return json(404, { error: "Unknown Exam Oracle endpoint." });
}
