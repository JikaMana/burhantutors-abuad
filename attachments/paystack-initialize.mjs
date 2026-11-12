import { FieldValue } from "firebase-admin/firestore";
import {
  authenticatedUser,
  firebaseServices,
  json,
  originAllowed,
} from "./lib/account.mjs";

const PRICE_KOBO = 150000;

export default async function handler(req) {
  if (req.method !== "POST") return json(405, { error: "Use POST." });
  if (!originAllowed(req))
    return json(403, { error: "Request origin is not allowed." });

  let user;
  try {
    user = await authenticatedUser(req);
  } catch {
    return json(401, { error: "Please sign in again to continue." });
  }
  if (!user) return json(401, { error: "Sign in to purchase paid access." });
  if (!user.email)
    return json(400, { error: "Your account needs an email address." });
  if (!process.env.PAYSTACK_SECRET_KEY)
    return json(503, { error: "Payments are not configured yet." });

  if (!process.env.SITE_URL)
    return json(503, { error: "SITE_URL is not configured." });
  let callbackUrl;
  try {
    callbackUrl = new URL("/exam-oracle.html", process.env.SITE_URL);
  } catch {
    return json(503, { error: "SITE_URL is not configured correctly." });
  }
  callbackUrl.searchParams.set("payment", "paystack");

  try {
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
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
      },
    );
    const result = await response.json();
    if (!response.ok || !result.status || !result.data?.authorization_url) {
      console.error(
        "Paystack initialization failed",
        result.message || response.status,
      );
      return json(502, { error: "Could not start payment. Please try again." });
    }
    const reference = result.data.reference;
    const { db } = firebaseServices();
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
      transaction.set(
        userRef.collection("activity").doc(`payment_${reference}_started`),
        {
          type: "payment_started",
          reference,
          amount: PRICE_KOBO,
          currency: "NGN",
          plan: "oracle-semester",
          occurredAt: timestamp,
        },
      );
      transaction.set(
        userRef,
        {
          email: user.email,
          lastActivityAt: timestamp,
          updatedAt: timestamp,
        },
        { merge: true },
      );
    });
    return json(200, { authorizationUrl: result.data.authorization_url });
  } catch (error) {
    console.error("Paystack initialization error", error?.message);
    return json(502, { error: "Could not reach Paystack. Please try again." });
  }
}
