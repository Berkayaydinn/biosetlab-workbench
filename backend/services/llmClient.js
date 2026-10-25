const { nodeHttpsFetch } = require("./llmHttpClient");
const DEFAULT_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_TIMEOUT_MS = 30000;

async function generateCompletion({
  systemPrompt,
  userPrompt,
  fetchImpl = globalThis.fetch || nodeHttpsFetch,
}) {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;
  const baseUrl = (process.env.LLM_BASE_URL || DEFAULT_BASE_URL)
    .replace(/\/+$/, "");

  if (!apiKey || !model) {
    throw new Error(
      "LLM is not configured. Set LLM_API_KEY and LLM_MODEL."
    );
  }

  const timeoutMs = Number(
    process.env.LLM_TIMEOUT_MS || DEFAULT_TIMEOUT_MS
  );

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("Invalid LLM_TIMEOUT_MS configuration.");
  }

  const response = await fetchImpl(
    `${baseUrl}/chat/completions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
          ...(process.env.LLM_PROVIDER === "ollama"
            ? { think: false }
            : {}),
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(timeoutMs),
    }
  );

  if (!response.ok) {
    throw new Error(
      `LLM provider request failed with HTTP ${response.status}.`
    );
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("LLM provider returned an empty response.");
  }

  let parsed;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("LLM provider returned invalid JSON.");
  }

  if (
    parsed === null ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    throw new Error("LLM provider returned a non-object JSON value.");
  }

  return parsed;
}

module.exports = {
  generateCompletion,
};
