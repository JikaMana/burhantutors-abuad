// @ts-nocheck
import { createHmac, timingSafeEqual } from "node:crypto";
import { PROMO_UNTIL } from "./questions.mjs";

const memory = new Map();
const payments = new Map();

export function firebaseConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

export function authMode() {
  return firebaseConfigured() ? "firebase" : "local";
}

export function promoUntilDate() {
  return process.env.ORACLE_FREE_UNTIL || PROMO_UNTIL;
}

export function promoActive(now = Date.now()) {
  const end = new Date(`${promoUntilDate()}T23:59:59+01:00`).getTime();
  return Number.isFinite(end) && now <= end;
}

export function lagosDay(now = Date.now()) {
  return new Date(now + 3600 * 1000).toISOString().slice(0, 10);
}

export function originAllowed(req) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  let originHost;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const hosts = [
    req.headers.get("host"),
    req.headers.get("x-forwarded-host"),
    new URL(req.url).host,
  ]
    .filter(Boolean)
    .map((host) => host.split(",")[0].trim());
  const extra = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
  return hosts.includes(originHost) || extra.includes(originHost);
}

export const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

function memoryUser(uid) {
  if (!memory.has(uid)) {
    memory.set(uid, {
      email: null,
      premiumUntil: null,
      usage: {},
      daily: {},
      tests: [],
      seen: [],
      payments: {},
    });
  }
  return memory.get(uid);
}

let firebasePromise;
async function firebaseServices() {
  if (!firebasePromise) {
    firebasePromise = (async () => {
      const { cert, getApps, initializeApp } = await import("firebase-admin/app");
      const { getAuth } = await import("firebase-admin/auth");
      const { getFirestore } = await import("firebase-admin/firestore");
      if (!getApps().length) {
        const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not configured.");
        const serviceAccount = JSON.parse(raw);
        initializeApp({
          credential: cert({
            ...serviceAccount,
            privateKey: serviceAccount.private_key?.replace(/\\n/g, "\n"),
          }),
        });
      }
      return { auth: getAuth(), db: getFirestore() };
    })();
  }
  return firebasePromise;
}

export async function authenticatedUser(req, required = true) {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!firebaseConfigured()) {
    if (match && match[1].startsWith("local:")) {
      const id = match[1].slice(6);
      if (/^[a-zA-Z0-9_-]{8,80}$/.test(id)) {
        return { uid: `local_${id}`, email: null, local: true };
      }
    }
    if (!required) return null;
    return null;
  }
  if (!match) return required ? null : null;
  try {
    const { auth } = await firebaseServices();
    return await auth.verifyIdToken(match[1]);
  } catch (error) {
    if (!required) throw error;
    throw error;
  }
}

export async function hasPremium(uid) {
  if (!uid) return false;
  if (promoActive()) return true;
  if (!firebaseConfigured() || String(uid).startsWith("local_")) {
    const until = memoryUser(uid).premiumUntil;
    return Boolean(until && new Date(until).getTime() > Date.now());
  }
  const { db } = await firebaseServices();
  const user = await db.collection("oracleUsers").doc(uid).get();
  const expiresAt = user.get("premiumUntil");
  return Boolean(expiresAt && expiresAt.toMillis() > Date.now());
}

export const PREMIUM_ACCESS_MONTHS = 6;

export function paidAccessExpiry(start = new Date()) {
  const expiry = new Date(start);
  const day = expiry.getUTCDate();
  expiry.setUTCDate(1);
  expiry.setUTCMonth(expiry.getUTCMonth() + PREMIUM_ACCESS_MONTHS);
  const lastDay = new Date(
    Date.UTC(expiry.getUTCFullYear(), expiry.getUTCMonth() + 1, 0),
  ).getUTCDate();
  expiry.setUTCDate(Math.min(day, lastDay));
  return expiry;
}

export function activeCourseIds(used) {
  return Object.keys(used || {}).filter((course) => used[course] > 0);
}

export async function readDailyUsage(uid) {
  if (!uid) return {};
  const day = lagosDay();
  if (!firebaseConfigured() || String(uid).startsWith("local_")) {
    return { ...(memoryUser(uid).daily[day] || {}) };
  }
  const { db } = await firebaseServices();
  const snapshot = await db
    .collection("oracleUsers")
    .doc(uid)
    .collection("dailyUsage")
    .doc(day)
    .get();
  return snapshot.get("courses") || {};
}

export async function recordFreeUsage(uid, course, count, freeDaily, freeCourses) {
  const day = lagosDay();
  const apply = (used) => {
    const current = Number(used[course]) || 0;
    if (current + count > freeDaily) return { allowed: false, code: "quota", used: current };
    const active = activeCourseIds(used);
    if (!used[course] && active.length >= freeCourses) {
      return { allowed: false, code: "subject_limit", subjectsUsed: active.length };
    }
    const next = current + count;
    const courses = { ...used, [course]: next };
    return { allowed: true, used: next, courses, subjectsUsed: activeCourseIds(courses).length };
  };

  if (!firebaseConfigured() || String(uid).startsWith("local_")) {
    const user = memoryUser(uid);
    const used = { ...(user.daily[day] || {}) };
    const result = apply(used);
    if (result.allowed) user.daily[day] = result.courses;
    return result;
  }

  const { db, FieldValue } = await firebaseBundle();
  const dailyRef = db.collection("oracleUsers").doc(uid).collection("dailyUsage").doc(day);
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(dailyRef);
    const used = snapshot.get("courses") || {};
    const result = apply(used);
    if (!result.allowed) return result;
    transaction.set(
      dailyRef,
      { courses: result.courses, updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    return result;
  });
}

async function firebaseBundle() {
  const services = await firebaseServices();
  const { FieldValue, Timestamp } = await import("firebase-admin/firestore");
  return { ...services, FieldValue, Timestamp };
}

export async function recordPaidUsage(user, course, questionCount) {
  if (!user || questionCount < 1 || promoActive()) return;
  if (!firebaseConfigured() || user.local) {
    const row = memoryUser(user.uid);
    const day = lagosDay();
    row.usage.paidQuestionsTotal = Number(row.usage.paidQuestionsTotal || 0) + questionCount;
    row.usage.paidQuestionsByDay = row.usage.paidQuestionsByDay || {};
    row.usage.paidQuestionsByDay[day] =
      Number(row.usage.paidQuestionsByDay[day] || 0) + questionCount;
    row.usage.paidQuestionsByCourse = row.usage.paidQuestionsByCourse || {};
    row.usage.paidQuestionsByCourse[course] =
      Number(row.usage.paidQuestionsByCourse[course] || 0) + questionCount;
    return;
  }
  const { db, FieldValue } = await firebaseBundle();
  const day = lagosDay();
  await db.collection("oracleUsers").doc(user.uid).set(
    {
      email: user.email || null,
      usage: {
        paidQuestionsTotal: FieldValue.increment(questionCount),
        paidQuestionsByDay: { [day]: FieldValue.increment(questionCount) },
        paidQuestionsByCourse: { [course]: FieldValue.increment(questionCount) },
        lastPaidPracticeAt: FieldValue.serverTimestamp(),
      },
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function readSeen(uid) {
  if (!uid) return [];
  if (!firebaseConfigured() || String(uid).startsWith("local_")) {
    return memoryUser(uid).seen.slice();
  }
  const { db } = await firebaseServices();
  const snapshot = await db.collection("oracleUsers").doc(uid).get();
  const seen = snapshot.get("seenPrompts");
  return Array.isArray(seen) ? seen.filter((item) => typeof item === "string") : [];
}

export async function writeSeen(uid, prompts) {
  const next = [];
  for (const prompt of prompts || []) {
    const text = String(prompt || "").replace(/\s+/g, " ").trim().slice(0, 140);
    if (text && !next.includes(text)) next.push(text);
  }
  if (!next.length || !uid) return;
  if (!firebaseConfigured() || String(uid).startsWith("local_")) {
    const user = memoryUser(uid);
    user.seen = [...user.seen, ...next].slice(-80);
    return;
  }
  try {
    const { db } = await firebaseServices();
    const ref = db.collection("oracleUsers").doc(uid);
    const snapshot = await ref.get();
    const prior = Array.isArray(snapshot.get("seenPrompts")) ? snapshot.get("seenPrompts") : [];
    const merged = [...prior, ...next].slice(-80);
    await ref.set({ seenPrompts: merged }, { merge: true });
  } catch (error) {
    console.error("Could not store seen prompts", error?.message);
  }
}

export async function readProfile(uid) {
  if (!firebaseConfigured() || String(uid).startsWith("local_")) {
    const user = memoryUser(uid);
    return {
      premiumUntil: user.premiumUntil,
      usage: user.usage,
      tests: user.tests.filter((test) => test.status === "completed").slice(0, 20),
    };
  }
  const { db } = await firebaseServices();
  const userSnapshot = await db.collection("oracleUsers").doc(uid).get();
  const premiumUntil = userSnapshot.get("premiumUntil");
  const snapshot = await db
    .collection("oracleUsers")
    .doc(uid)
    .collection("tests")
    .orderBy("completedAt", "desc")
    .limit(20)
    .get();
  return {
    premiumUntil: premiumUntil?.toDate?.().toISOString() || null,
    usage: userSnapshot.get("usage") || {},
    tests: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
  };
}

export async function saveActivity(user, input) {
  if (!firebaseConfigured() || user.local) return saveActivityMemory(user, input);
  return saveActivityFirebase(user, input);
}

function saveActivityMemory(user, input) {
  const row = memoryUser(user.uid);
  const id = String(input.id);
  let test = row.tests.find((item) => String(item.id) === id);
  const now = new Date().toISOString();
  if (input.action === "start") {
    if (!test) {
      test = {
        id,
        course: input.course,
        topics: input.topics,
        total: input.total,
        status: "in_progress",
        startedAt: now,
        answers: {},
      };
      row.tests.unshift(test);
    }
    return { saved: true, id, status: 201 };
  }
  if (!test) {
    test = { id, course: input.course, topics: input.topics, status: "in_progress", answers: {} };
    row.tests.unshift(test);
  }
  if (input.action === "answer") {
    test.answers = test.answers || {};
    test.answers[input.index] = input.answer;
    return { saved: true, id, status: 200 };
  }
  if (input.action === "solution" || input.action === "abandon") {
    if (input.action === "abandon" && test.status === "in_progress") {
      test.status = "abandoned";
      test.abandonedAt = now;
    }
    return { saved: true, id, status: 200 };
  }
  test.course = input.course;
  test.topics = input.topics;
  test.total = input.total;
  test.correct = input.correct;
  test.score = Math.round((input.correct / input.total) * 100);
  test.topicResults = input.topicResults;
  test.answers = input.answers;
  test.status = "completed";
  test.completedAt = now;
  test.date = Date.now();
  return { saved: true, id, status: 201 };
}

async function saveActivityFirebase(user, input) {
  const { FieldValue } = await import("firebase-admin/firestore");
  const { db } = await firebaseServices();
  const testId = String(input.id);
  const historyRef = db.collection("oracleUsers").doc(user.uid).collection("tests");
  const testRef = historyRef.doc(testId);
  const accountRef = db.collection("oracleUsers").doc(user.uid);
  const activity = accountRef.collection("activity");
  const course = input.course;
  const topics = input.topics;
  const total = input.total;

  if (input.action === "start") {
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
        { email: user.email || null, lastActivityAt: timestamp, updatedAt: timestamp },
        { merge: true },
      );
    });
    return { saved: true, id: testId, status: 201 };
  }

  if (input.action === "answer") {
    const timestamp = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(testRef);
      if (!existing.exists || existing.get("status") !== "in_progress") return;
      transaction.set(testRef, { answers: { [input.index]: input.answer } }, { merge: true });
      transaction.set(activity.doc(`test_${testId}_answer_${input.index}`), {
        type: "question_answered",
        testId,
        course,
        index: input.index,
        ...input.answer,
        occurredAt: timestamp,
      });
      transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
    });
    return { saved: true, id: testId, status: 200 };
  }

  if (input.action === "solution") {
    const timestamp = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(testRef);
      if (!existing.exists || existing.get("status") !== "in_progress") return;
      transaction.set(activity.doc(`test_${testId}_solution_${input.index}`), {
        type: "solution_viewed",
        testId,
        course,
        index: input.index,
        topic: input.topic,
        occurredAt: timestamp,
      });
      transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
    });
    return { saved: true, id: testId, status: 200 };
  }

  if (input.action === "abandon") {
    const timestamp = FieldValue.serverTimestamp();
    await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(testRef);
      if (!existing.exists || existing.get("status") !== "in_progress") return;
      transaction.set(testRef, { status: "abandoned", abandonedAt: timestamp }, { merge: true });
      transaction.set(activity.doc(`test_${testId}_abandoned`), {
        type: "test_abandoned",
        testId,
        course,
        occurredAt: timestamp,
      });
      transaction.set(accountRef, { lastActivityAt: timestamp }, { merge: true });
    });
    return { saved: true, id: testId, status: 200 };
  }

  const correct = input.correct;
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
        topicResults: input.topicResults,
        answers: input.answers,
        status: "completed",
        completedAt: timestamp,
      },
      { merge: true },
    );
    transaction.set(
      accountRef,
      { email: user.email || null, lastActivityAt: timestamp, updatedAt: timestamp },
      { merge: true },
    );
    transaction.set(activity.doc(`test_${testId}_completed`), {
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
  return { saved: true, id: testRef.id, status: saved ? 201 : 200 };
}

export function siteOrigin(req) {
  const raw = process.env.SITE_URL;
  if (raw) {
    try {
      const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      return new URL(withProto).origin;
    } catch {
      /* fall through to the request origin */
    }
  }
  return new URL(req.url).origin;
}

const PRICE_KOBO = 150000;

export async function grantPremium({ uid, email, reference, amount, currency }) {
  if (!firebaseConfigured() || String(uid).startsWith("local_")) {
    const prior = payments.get(reference);
    if (prior && prior.uid !== uid) {
      throw new Error("Payment reference already belongs to another account.");
    }
    if (prior?.status === "success" && prior.premiumUntil) return new Date(prior.premiumUntil);
    const user = memoryUser(uid);
    const currentExpiry = user.premiumUntil ? new Date(user.premiumUntil) : null;
    const start =
      currentExpiry && currentExpiry.getTime() > Date.now() ? currentExpiry : new Date();
    const expiry = paidAccessExpiry(start);
    user.email = email || user.email;
    user.premiumUntil = expiry.toISOString();
    payments.set(reference, {
      uid,
      amount,
      currency,
      status: "success",
      premiumUntil: expiry.toISOString(),
    });
    return expiry;
  }

  const { db, FieldValue, Timestamp } = await firebaseBundle();
  const userRef = db.collection("oracleUsers").doc(uid);
  const paymentRef = db.collection("oraclePayments").doc(reference);
  const activityRef = userRef.collection("activity").doc(`payment_${reference}_succeeded`);
  return db.runTransaction(async (transaction) => {
    const priorPayment = await transaction.get(paymentRef);
    if (priorPayment.exists && priorPayment.get("uid") !== uid) {
      throw new Error("Payment reference already belongs to another account.");
    }
    const existingExpiry = priorPayment.get("premiumUntil")?.toDate?.();
    if (priorPayment.get("status") === "success" && existingExpiry) return existingExpiry;
    const currentUser = await transaction.get(userRef);
    const currentExpiry = currentUser.get("premiumUntil")?.toDate?.();
    const start =
      currentExpiry && currentExpiry.getTime() > Date.now() ? currentExpiry : new Date();
    const expiry = paidAccessExpiry(start);
    const timestamp = FieldValue.serverTimestamp();
    transaction.set(
      userRef,
      {
        email: email || null,
        premiumUntil: Timestamp.fromDate(expiry),
        lastPaymentReference: reference,
        lastActivityAt: timestamp,
        updatedAt: timestamp,
      },
      { merge: true },
    );
    transaction.set(
      paymentRef,
      {
        uid,
        amount,
        currency,
        status: "success",
        plan: "oracle-semester",
        premiumUntil: Timestamp.fromDate(expiry),
        verifiedAt: timestamp,
      },
      { merge: true },
    );
    transaction.set(activityRef, {
      type: "payment_succeeded",
      reference,
      amount,
      currency,
      plan: "oracle-semester",
      premiumUntil: Timestamp.fromDate(expiry),
      occurredAt: timestamp,
    });
    return expiry;
  });
}

export async function initializePayment(user, req) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return json(503, { error: "Payments are not configured yet." });
  }
  if (!user.email) {
    return json(400, {
      error: user.local
        ? "Paid checkout needs the email on your Exam Oracle account."
        : "Your account needs an email address.",
    });
  }
  let callbackUrl;
  try {
    callbackUrl = new URL("/exam-oracle.html", siteOrigin(req));
  } catch {
    return json(503, { error: "SITE_URL is not configured correctly." });
  }
  callbackUrl.searchParams.set("payment", "paystack");
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: PRICE_KOBO,
      currency: "NGN",
      callback_url: callbackUrl.toString(),
      metadata: { oracleUid: user.uid, plan: "oracle-semester" },
    }),
  });
  const result = await response.json();
  if (!response.ok || !result.status || !result.data?.authorization_url) {
    console.error("Paystack initialization failed", result.message || response.status);
    return json(502, { error: "Could not start payment. Please try again." });
  }
  const reference = result.data.reference;
  if (!firebaseConfigured() || user.local) {
    payments.set(reference, {
      uid: user.uid,
      amount: PRICE_KOBO,
      currency: "NGN",
      status: "pending",
    });
  } else {
    const { db, FieldValue } = await firebaseBundle();
    const timestamp = FieldValue.serverTimestamp();
    const userRef = db.collection("oracleUsers").doc(user.uid);
    await db.runTransaction(async (transaction) => {
      transaction.set(db.collection("oraclePayments").doc(reference), {
        uid: user.uid,
        amount: PRICE_KOBO,
        currency: "NGN",
        status: "pending",
        plan: "oracle-semester",
        createdAt: timestamp,
      });
      transaction.set(userRef.collection("activity").doc(`payment_${reference}_started`), {
        type: "payment_started",
        reference,
        amount: PRICE_KOBO,
        currency: "NGN",
        plan: "oracle-semester",
        occurredAt: timestamp,
      });
      transaction.set(
        userRef,
        { email: user.email, lastActivityAt: timestamp, updatedAt: timestamp },
        { merge: true },
      );
    });
  }
  return json(200, { authorizationUrl: result.data.authorization_url });
}

export async function verifyPayment(user, reference) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return json(503, { error: "Payments are not configured yet." });
  }
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } },
  );
  const result = await response.json();
  const payment = result.data;
  if (
    !response.ok ||
    !result.status ||
    payment?.status !== "success" ||
    payment.amount !== PRICE_KOBO ||
    payment.currency !== "NGN" ||
    payment.metadata?.oracleUid !== user.uid ||
    payment.metadata?.plan !== "oracle-semester"
  ) {
    return json(402, { error: "This payment could not be verified for your account." });
  }
  const expiry = await grantPremium({
    uid: user.uid,
    email: user.email,
    reference,
    amount: PRICE_KOBO,
    currency: "NGN",
  });
  return json(200, { paid: true, premiumUntil: expiry.toISOString() });
}

export async function handlePaystackWebhook(req) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return new Response("Webhook is not configured.", { status: 503 });
  const rawBody = await req.text();
  const supplied = req.headers.get("x-paystack-signature") || "";
  const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
  const suppliedBuffer = Buffer.from(supplied, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  if (
    suppliedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(suppliedBuffer, expectedBuffer)
  ) {
    return new Response("Invalid signature.", { status: 401 });
  }
  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON.", { status: 400 });
  }
  if (event.event !== "charge.success") return new Response("OK", { status: 200 });
  const payment = event.data;
  if (
    payment?.status !== "success" ||
    payment.amount !== PRICE_KOBO ||
    payment.currency !== "NGN" ||
    payment.metadata?.plan !== "oracle-semester" ||
    typeof payment.metadata?.oracleUid !== "string" ||
    typeof payment.reference !== "string"
  ) {
    return new Response("Payment does not match an Oracle plan.", { status: 400 });
  }
  try {
    await grantPremium({
      uid: payment.metadata.oracleUid,
      email: payment.customer?.email,
      reference: payment.reference,
      amount: payment.amount,
      currency: payment.currency,
    });
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Paystack webhook processing failed", error?.message);
    return new Response("Could not process payment.", { status: 500 });
  }
}

export function __memoryForTests() {
  return { memory, payments };
}
