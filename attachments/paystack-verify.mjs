import {
  authenticatedUser,
  grantPremium,
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
    return json(401, { error: "Please sign in again to verify payment." });
  }
  if (!user) return json(401, { error: "Sign in to verify payment." });
  if (!process.env.PAYSTACK_SECRET_KEY)
    return json(503, { error: "Payments are not configured yet." });

  let reference;
  try {
    reference = (await req.json()).reference;
  } catch {
    return json(400, { error: "Payment reference is missing." });
  }
  if (typeof reference !== "string" || !/^[\w-]{8,100}$/.test(reference))
    return json(400, { error: "Payment reference is invalid." });

  try {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      },
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
      return json(402, {
        error: "This payment could not be verified for your account.",
      });
    }

    const expiry = await grantPremium({
      uid: user.uid,
      email: user.email,
      reference,
      amount: PRICE_KOBO,
      currency: "NGN",
    });
    return json(200, { paid: true, premiumUntil: expiry.toISOString() });
  } catch (error) {
    console.error("Paystack verification error", error?.message);
    return json(502, { error: "Could not verify payment right now." });
  }
}
