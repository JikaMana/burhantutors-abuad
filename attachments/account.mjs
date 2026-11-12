import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";

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

export function firebaseServices() {
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
}

export async function authenticatedUser(req, required = true) {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    if (!required) return null;
    return null;
  }
  const { auth } = firebaseServices();
  return auth.verifyIdToken(match[1]);
}

export async function hasPremium(uid) {
  if (!uid) return false;
  const { db } = firebaseServices();
  const user = await db.collection("oracleUsers").doc(uid).get();
  const expiresAt = user.get("premiumUntil");
  return Boolean(expiresAt && expiresAt.toMillis() > Date.now());
}

export const PREMIUM_ACCESS_MONTHS = 6;

export const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });

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

export async function grantPremium({
  uid,
  email,
  reference,
  amount,
  currency,
}) {
  const { db } = firebaseServices();
  const userRef = db.collection("oracleUsers").doc(uid);
  const paymentRef = db.collection("oraclePayments").doc(reference);
  const activityRef = userRef
    .collection("activity")
    .doc(`payment_${reference}_succeeded`);

  return db.runTransaction(async (transaction) => {
    const priorPayment = await transaction.get(paymentRef);
    if (priorPayment.exists && priorPayment.get("uid") !== uid) {
      throw new Error("Payment reference already belongs to another account.");
    }
    const existingExpiry = priorPayment.get("premiumUntil")?.toDate?.();
    if (priorPayment.get("status") === "success" && existingExpiry) {
      return existingExpiry;
    }

    const currentUser = await transaction.get(userRef);
    const currentExpiry = currentUser.get("premiumUntil")?.toDate?.();
    const start =
      currentExpiry && currentExpiry.getTime() > Date.now()
        ? currentExpiry
        : new Date();
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
