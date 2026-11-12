// @ts-nocheck
const RESPONSE_HINT = `Return JSON only, with this shape:
{"questions":[{"topic":"","prompt":"","options":["","","",""],"answer":0,"steps":["",""]}]}`;

export function models() {
  return (process.env.DEEPSEEK_MODELS || process.env.DEEPSEEK_MODEL || "deepseek-flash")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean);
}

export function buildPrompt({ course, cfg, topics, count, avoid, batch }) {
  const avoidBlock = avoid.length
    ? `\nDo NOT repeat or closely paraphrase these questions already asked:\n${avoid
        .map((item) => `- ${item}`)
        .join("\n")}\n`
    : "";
  return `You write practice questions for ABUAD (Afe Babalola University) ${course} (${cfg.name}), in the style of Nigerian university computer-based tests (CBT).

Write exactly ${count} multiple-choice questions on these topics only: ${topics.join("; ")}.
Rules:
- Exactly 4 options. Exactly one is correct. "answer" is the zero-based index (0 to 3) of the correct option.
- Wrong options must be plausible (typical student mistakes), never silly.
- Match the difficulty of ABUAD 100-level CBT papers: short stems, one idea each, a mix of recall and short working.
- This is set #${batch + 1}. Use fresh numbers and situations. Do not reuse a stem with only a number changed if the method is identical to an avoided question.
- Solve every question yourself and verify the answer before returning it.
- Plain text only. No LaTeX, no markdown, no $ signs. Write maths as x^2, sqrt(x), a/b, 3 + 4i.
- "steps": 2 to 4 short strings showing the working.
- "topic" must be copied exactly from the topic list above.
${avoidBlock}
SOURCE MATERIAL:
${cfg.source}

${RESPONSE_HINT}`;
}

function parseModelJson(text) {
  const cleaned = String(text || "")
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON object");
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function requestModel(apiKey, model, prompt, extras) {
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(14000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are Exam Oracle, writing verified ABUAD CBT practice questions. Reply with one JSON object and nothing else.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2500,
      ...extras,
    }),
  });
  return response;
}

export async function callDeepSeek(apiKey, prompt) {
  let last = { status: 502, message: "DeepSeek did not respond" };
  for (const model of models()) {
    const attempts = [{ thinking: { type: "disabled" }, reasoning_effort: "none" }, {}];
    for (const extras of attempts) {
      try {
        const response = await requestModel(apiKey, model, prompt, extras);
        if (response.ok) {
          const data = await response.json();
          const text = data.choices?.[0]?.message?.content || "";
          if (!text.trim()) {
            last = { status: 502, message: "Empty response" };
            continue;
          }
          return { parsed: parseModelJson(text), model };
        }
        const err = await response.json().catch(() => ({}));
        last = {
          status: response.status,
          message: err?.error?.message || err?.message || "unknown",
        };
        console.error("DeepSeek error", {
          model,
          status: response.status,
          message: String(last.message).slice(0, 400),
        });
        if (response.status === 400 && extras.thinking) continue;
        if (![404, 429, 500, 503].includes(response.status)) break;
      } catch (error) {
        console.error("DeepSeek fetch failed", {
          model,
          name: error?.name,
          message: error?.message,
        });
        last = {
          status: error?.name === "TimeoutError" || error?.name === "AbortError" ? 504 : 502,
          message: error?.message,
        };
      }
    }
  }
  return { error: last };
}
