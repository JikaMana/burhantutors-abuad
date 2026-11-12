import { FieldValue } from "firebase-admin/firestore";
import {
  authenticatedUser,
  firebaseServices,
  json,
  originAllowed,
} from "./lib/account.mjs";

export default async function handler(req) {
  if (req.method !== "GET" && !originAllowed(req))
    return json(403, { error: "Request origin is not allowed." });

  let user;
  try {
    user = await authenticatedUser(req);
  } catch {
    return json(401, { error: "Please sign in again to view test history." });
  }
  if (!user) return json(401, { error: "Sign in to use test history." });

  const { db } = firebaseServices();
  const historyRef = db
    .collection("oracleUsers")
    .doc(user.uid)
    .collection("tests");

  if (req.method === "GET") {
    const userSnapshot = await db.collection("oracleUsers").doc(user.uid).get();
    const snapshot = await historyRef
      .orderBy("completedAt", "desc")
      .limit(20)
      .get();
    const premiumUntil = userSnapshot.get("premiumUntil");
    return json(200, {
      premiumUntil: premiumUntil?.toDate?.().toISOString() || null,
      usage: userSnapshot.get("usage") || {},
      tests: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    });
  }

  if (req.method !== "POST") return json(405, { error: "Use GET or POST." });

  let input;
  try {
    input = await req.json();
  } catch {
    return json(400, { error: "Request body must be valid JSON." });
  }

  const course =
    typeof input.course === "string" ? input.course.slice(0, 40) : "";
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
    typeof input.id === "number" && Number.isSafeInteger(input.id)
      ? String(input.id)
      : "";
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
        topic:
          typeof answer?.topic === "string" ? answer.topic.slice(0, 80) : "",
        prompt:
          typeof answer?.prompt === "string"
            ? answer.prompt.slice(0, 2000)
            : "",
        options: Array.isArray(answer?.options)
          ? answer.options
              .filter((option) => typeof option === "string")
              .slice(0, 4)
              .map((option) => option.slice(0, 500))
          : [],
        selected: Math.max(0, Math.min(Number(answer?.selected) || 0, 3)),
        correctAnswer: Math.max(
          0,
          Math.min(Number(answer?.correctAnswer) || 0, 3),
        ),
        correct: answer?.correct === true,
      }))
    : [];
  if (!course || !testId)
    return json(400, { error: "Test activity is invalid." });
  const testRef = historyRef.doc(testId);
  const accountRef = db.collection("oracleUsers").doc(user.uid);
  const activity = accountRef.collection("activity");

  if (action === "start") {
    if (!Number.isInteger(total) || total < 1 || total > 60)
      return json(400, { error: "Test setup is invalid." });
    const timestamp = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(testRef);
      if (existing.exists) return;
      transaction.set(testRef, {
        course,
        topics,
        total,
        status: "in_progress",
        startedAt: timestamp,
      });
      transaction.set(activity.doc(`test_${testId}_started`), {
        type: "test_started",
        testId,
        course,
        total,
        occurredAt: timestamp,
      });
      transaction.set(
        accountRef,
        {
          email: user.email || null,
          lastActivityAt: timestamp,
          updatedAt: timestamp,
        },
        { merge: true },
      );
    });
    return json(201, { saved: true, id: testId });
  }

  if (action === "answer") {
    const index = Number(input.index);
    const answer =
      input.answer && typeof input.answer === "object" ? input.answer : {};
    if (!Number.isInteger(index) || index < 0 || index >= 60)
      return json(400, { error: "Answer activity is invalid." });
    const answerRecord = {
      topic: typeof answer.topic === "string" ? answer.topic.slice(0, 80) : "",
      prompt:
        typeof answer.prompt === "string" ? answer.prompt.slice(0, 2000) : "",
      options: Array.isArray(answer.options)
        ? answer.options
            .filter((option) => typeof option === "string")
            .slice(0, 4)
            .map((option) => option.slice(0, 500))
        : [],
      selected: Math.max(0, Math.min(Number(answer.selected) || 0, 3)),
      correctAnswer: Math.max(
        0,
        Math.min(Number(answer.correctAnswer) || 0, 3),
      ),
      correct: answer.correct === true,
    };
    if (!answerRecord.prompt || answerRecord.options.length !== 4)
      return json(400, { error: "Answer activity is invalid." });
    const timestamp = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(testRef);
      if (!existing.exists || existing.get("status") !== "in_progress") return;
      transaction.set(
        testRef,
        { answers: { [index]: answerRecord } },
        { merge: true },
      );
      transaction.set(activity.doc(`test_${testId}_answer_${index}`), {
        type: "question_answered",
        testId,
        course,
        index,
        ...answerRecord,
        occurredAt: timestamp,
      });
      transaction.set(
        accountRef,
        { lastActivityAt: timestamp },
        { merge: true },
      );
    });
    return json(200, { saved: true, id: testId, index });
  }

  if (action === "solution") {
    const index = Number(input.index);
    if (!Number.isInteger(index) || index < 0 || index >= 60)
      return json(400, { error: "Solution activity is invalid." });
    const timestamp = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(testRef);
      if (!existing.exists || existing.get("status") !== "in_progress") return;
      transaction.set(activity.doc(`test_${testId}_solution_${index}`), {
        type: "solution_viewed",
        testId,
        course,
        index,
        topic: typeof input.topic === "string" ? input.topic.slice(0, 80) : "",
        occurredAt: timestamp,
      });
      transaction.set(
        accountRef,
        { lastActivityAt: timestamp },
        { merge: true },
      );
    });
    return json(200, { saved: true, id: testId, index });
  }

  if (action === "abandon") {
    const timestamp = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(testRef);
      if (!existing.exists || existing.get("status") !== "in_progress") return;
      transaction.set(
        testRef,
        { status: "abandoned", abandonedAt: timestamp },
        { merge: true },
      );
      transaction.set(activity.doc(`test_${testId}_abandoned`), {
        type: "test_abandoned",
        testId,
        course,
        occurredAt: timestamp,
      });
      transaction.set(
        accountRef,
        { lastActivityAt: timestamp },
        { merge: true },
      );
    });
    return json(200, { saved: true, id: testId });
  }

  if (action !== "complete")
    return json(400, { error: "Test activity is invalid." });
  if (
    !Number.isInteger(total) ||
    total < 1 ||
    total > 60 ||
    !Number.isInteger(correct) ||
    correct < 0 ||
    correct > total
  )
    return json(400, { error: "Test summary is invalid." });

  const activityRef = activity.doc(`test_${testId}_completed`);
  const score = Math.round((correct / total) * 100);
  const saved = await db.runTransaction(async (transaction) => {
    const existing = await transaction.get(testRef);
    if (existing.exists && existing.get("status") === "completed") return false;
    const timestamp = FieldValue.serverTimestamp();
    transaction.set(
      testRef,
      {
        course,
        topics,
        total,
        correct,
        score,
        topicResults,
        answers,
        status: "completed",
        completedAt: timestamp,
      },
      { merge: true },
    );
    transaction.set(
      accountRef,
      {
        email: user.email || null,
        lastActivityAt: timestamp,
        updatedAt: timestamp,
      },
      { merge: true },
    );
    transaction.set(activityRef, {
      type: "test_completed",
      testId,
      course,
      total,
      correct,
      score,
      completedAt: timestamp,
    });
    return true;
  });

  return json(saved ? 201 : 200, { saved: true, id: testRef.id });
}
