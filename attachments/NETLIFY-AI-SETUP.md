# Exam Oracle AI Setup

Exam Oracle generates CBT-style practice questions with Gemini through a Netlify Function.
MTH 101 is grounded in `PDFs/final_pq.pdf`; the other courses use the standard 100-level syllabus until their PDFs are added in `netlify/functions/lib/courses.mjs`.

## Files

- `netlify/functions/generate-questions.mjs` — API (GET = courses + quota, POST = questions)
- `netlify/functions/lib/courses.mjs` — courses, topics and source text
- `package.json` — installs the Firebase Admin SDK for account, quota, and payment storage
- Delete the old `netlify/functions/generate-math.js`.

## Environment variables

For local development, copy `.env.example` to `.env`, fill in test credentials, then run `netlify dev`. Never commit `.env` or put server secrets in browser JavaScript.

| Name                       | Required         | Purpose                                                                                                 |
| -------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`           | yes              | Key from Google AI Studio.                                                                              |
| `FIREBASE_SERVICE_ACCOUNT` | yes              | Firebase Admin service-account JSON on one line. Keep it private.                                       |
| `PAYSTACK_SECRET_KEY`      | yes for checkout | Paystack secret key. Use a test secret locally and live secret in production.                           |
| `PAYSTACK_SECRET_KEY`      | yes for webhook  | Configure the Paystack webhook URL as `https://<site-domain>/.netlify/functions/paystack-webhook`.      |
| `SITE_URL`                 | recommended      | Canonical site origin, e.g. `http://localhost:8888` locally and the production HTTPS origin in Netlify. |
| `GEMINI_MODELS`            | no               | Override model list (default is configured in the function).                                            |
| `FUNCTION_BUDGET_MS`       | no               | Default 9000. Raise only if the function timeout is also increased.                                     |
| `ALLOWED_ORIGINS`          | no               | Extra allowed origin hostnames, comma-separated.                                                        |

In Netlify, add the production values under Site configuration > Environment variables and redeploy after changes.

## Firebase and Paystack setup

1. In Firebase Console, enable Authentication providers **Email/Password** and **Google**. Add the local Netlify URL and production domain to Authentication > Settings > Authorized domains.
2. Create/enable Cloud Firestore in the same project. Create a Firebase service account in Project settings > Service accounts and store its JSON as `FIREBASE_SERVICE_ACCOUNT` in the local `.env` and Netlify function environment. The Admin SDK accesses Firestore only from functions; do not expose this credential to the browser.
   Ensure Firestore security rules do not allow client reads or writes to `oracleUsers` or `oraclePayments`; only the Admin SDK functions should manage paid entitlements and payment records. Check for broad wildcard allow rules, since Firestore combines matching allows permissively.
3. The public Firebase web config in `exam-oracle.html` is expected to be visible. Restrict its API key to the website domains in Google Cloud API key settings.
4. Configure the Paystack callback domain allowlists and webhook URL as `https://<site-domain>/.netlify/functions/paystack-webhook`. The webhook signature is verified using `PAYSTACK_SECRET_KEY`. Use a Paystack **test secret key** locally and test transactions before switching to the live secret in production.
5. A verified ₦1,500 NGN transaction grants premium access to the Firebase UID in Paystack metadata for six calendar months. The duration is configured by `PREMIUM_ACCESS_MONTHS` in `netlify/functions/lib/account.mjs`.
6. Run `netlify dev` and open the local URL it reports. Test email registration/sign-in, Google sign-in, a Paystack test payment, return verification, and a premium question request.

Existing access codes are no longer checked. If you have already-paid students who need access, record their Firebase UIDs and migrate those entitlements into the `oracleUsers/{uid}` Firestore documents (`premiumUntil` as a Firestore Timestamp) using a trusted admin workflow.

## How limits work

- To give every visitor premium access temporarily, set `SITEWIDE_PREMIUM` to `true` near the `Limits` constants in `netlify/functions/generate-questions.mjs`; set it back to `false` when the promotion ends, then redeploy. No expiry date is needed; the code switch stays on until you turn it off.
- Free: 10 questions per course, across up to 3 distinct courses per day, tracked per signed-in Firebase account in Firestore (resets at midnight Lagos time).
- All tests require a signed-in Firebase account. Free quotas are still available to signed-in users and reset at midnight Lagos time.
- Paid access costs ₦1,500 for six calendar months and is attached to the signed-in Firebase account after server-side Paystack verification.
- Paid access has no daily or course quota and allows up to 60 questions per test until the account's Firestore `premiumUntil` timestamp.
- Test starts, answers, solution views, abandoned tests, completed reports, checkout starts, and verified payments are recorded under the user's Firestore account. Completed tests are retained; the UI displays the latest 20.
- Questions are fetched 5 at a time, 2 requests in parallel, so each call stays inside Netlify's ~10s limit. The test starts as soon as the first batch arrives.

## Debugging

Netlify > Logs > Functions > `generate-questions`. Provider failures log `Gemini error { model, status, message }`.
The browser error also carries the provider status code (e.g. 404 = wrong model name, 403 = bad key, 429 = rate limit).

Have a lecturer or tutor spot-check generated answers before relying on them for exam prep.
