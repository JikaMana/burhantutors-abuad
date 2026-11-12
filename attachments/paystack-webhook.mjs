import { createHmac, timingSafeEqual } from "node:crypto";
import { grantPremium } from "./lib/account.mjs";

const PRICE_KOBO = 150000;

export default async function handler(req) {
  if (req.method !== "POST")
    return new Response("Method not allowed.", { status: 405 });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret)
    return new Response("Webhook is not configured.", { status: 503 });

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
  if (event.event !== "charge.success")
    return new Response("OK", { status: 200 });

  const payment = event.data;
  if (
    payment?.status !== "success" ||
    payment.amount !== PRICE_KOBO ||
    payment.currency !== "NGN" ||
    payment.metadata?.plan !== "oracle-semester" ||
    typeof payment.metadata?.oracleUid !== "string" ||
    typeof payment.reference !== "string"
  ) {
    return new Response("Payment does not match an Oracle plan.", {
      status: 400,
    });
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
