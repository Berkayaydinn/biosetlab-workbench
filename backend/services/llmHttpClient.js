const http = require("node:http");
const https = require("node:https");

async function nodeHttpsFetch(url, options = {}) {
  const target = new URL(url);
  const isHttps = target.protocol === "https:";

  const localHosts = new Set([
    "localhost",
    "127.0.0.1",
    "host.docker.internal"
  ]);

  const isLocalOllama =
    target.protocol === "http:" &&
    localHosts.has(target.hostname) &&
    target.port === "11434" &&
    !target.username &&
    !target.password;

  if (!isHttps && !isLocalOllama) {
    throw new Error(
      "HTTP is allowed only for local Ollama on port 11434."
    );
  }

  const transport = isHttps ? https : http;

  const timeoutMs = Number(
    process.env.LLM_TIMEOUT_MS || 120000
  );

  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error("Invalid LLM_TIMEOUT_MS.");
  }

  return new Promise((resolve, reject) => {
    const req = transport.request(
      target,
      {
        method: options.method || "GET",
        headers: options.headers || {}
      },
      res => {
        let responseText = "";

        res.setEncoding("utf8");

        res.on("data", chunk => {
          responseText += chunk;

          if (responseText.length > 2_000_000) {
            req.destroy(new Error("LLM response too large."));
          }
        });

        res.on("end", () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: async () => JSON.parse(responseText)
          });
        });

        res.on("error", reject);
      }
    );

    const timer = setTimeout(() => {
      req.destroy(new Error("LLM request timed out."));
    }, timeoutMs);

    req.on("close", () => clearTimeout(timer));
    req.on("error", reject);

    if (options.signal) {
      if (options.signal.aborted) {
        req.destroy(new Error("LLM request aborted."));
      } else {
        options.signal.addEventListener(
          "abort",
          () => req.destroy(new Error("LLM request aborted.")),
          { once: true }
        );
      }
    }

    if (!req.destroyed) {
      req.end(options.body);
    }
  });
}

module.exports = { nodeHttpsFetch };
