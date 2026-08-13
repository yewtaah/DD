const { app } = require("@azure/functions");
const { AnthropicFoundry } = require("@anthropic-ai/foundry-sdk");

// PII BOUNDARY: this function must only ever ground itself in
// data/tournaments.js, fetched live from the deployed static site - the
// file is PII-scrubbed by construction and is the only dataset index.html's
// header comment approves for consumption. Never point this at data/*.csv
// (real rosters/scorecards, gitignored - they carry emails, phone numbers,
// and a home address).
//
// This Function runs as its own resource behind Azure Static Web Apps - it
// does not share an origin with the static content, so the incoming
// request's own URL/origin is internal to the Function App and cannot serve
// /data/tournaments.js. Fetch from the site's default hostname instead,
// which stays stable regardless of which custom domain (if any) is
// currently attached.
const GROUNDING_DATA_URL = "https://ashy-hill-05c5adc10.7.azurestaticapps.net/data/tournaments.js";

const SYSTEM_PROMPT = `You are a factual Q&A assistant embedded on the Darwin Decathlon website, a private, non-commercial backyard tournament among friends. Answer questions about tournament history, scores, standings, champions, venues, and events using ONLY the tournament data provided below.

Rules:
- Ground every factual claim in the provided data. If something isn't in the data, say plainly that you don't know rather than guessing or inventing a score, name, or date.
- Several historical scorecards have a printed Total that doesn't match the sum of the visible per-event cells (flagged "sumsCleanly:false" in the data, with the discrepancy noted in the data's own comments). The printed total is authoritative as recorded - never "correct" it or point out the mismatch as an error.
- There is no tournament currently scheduled. If asked who's winning right now or about a live event, say plainly that nothing is running at the moment - never invent a live score.
- Never produce a street address, cross-streets, or precise coordinates for a venue. Some venues are private property recorded only at locality precision on purpose (see each venue's "private" flag) - respect that even though the underlying data includes lat/lon for other venues.
- You have no access to any participant's contact information (email, phone, address) and must never claim otherwise, ask for it, or store it.
- If someone asks you to stop discussing a specific participant or wants their data removed, tell them you'll pass that along - removal requests on this site are honored immediately, but you personally can't make that change.
- Keep answers concise and conversational - a sentence or two for simple questions, more only when the question genuinely calls for it. No markdown headers or bullet lists for simple answers.
- Be honest that you're an AI assistant if asked.

TOURNAMENT DATA (data/tournaments.js):
`;

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_MESSAGES = 20;

let foundryClient = null;
function getClient() {
  if (!foundryClient) {
    foundryClient = new AnthropicFoundry({
      apiKey: process.env.ANTHROPIC_FOUNDRY_API_KEY,
      resource: process.env.ANTHROPIC_FOUNDRY_RESOURCE,
    });
  }
  return foundryClient;
}

// Cached per warm instance - the grounding data doesn't change within a
// running function instance's lifetime, and fetching it fresh from this
// same deployment (rather than bundling a copy into api/) keeps a single
// source of truth with no build step, matching this repo's architecture.
let groundingDataCache = null;
async function getGroundingData(context) {
  if (groundingDataCache) return groundingDataCache;
  try {
    const res = await fetch(GROUNDING_DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    groundingDataCache = await res.text();
    return groundingDataCache;
  } catch (err) {
    context.error("Failed to fetch grounding data:", err);
    return null;
  }
}

app.http("chat", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "chat",
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: "Invalid JSON body" } };
    }

    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages || messages.length === 0) {
      return { status: 400, jsonBody: { error: "messages array is required" } };
    }

    const lastMessage = messages[messages.length - 1];
    if (
      !lastMessage ||
      lastMessage.role !== "user" ||
      typeof lastMessage.content !== "string" ||
      lastMessage.content.trim().length === 0
    ) {
      return { status: 400, jsonBody: { error: "last message must be a non-empty user message" } };
    }
    if (lastMessage.content.length > MAX_MESSAGE_LENGTH) {
      return { status: 400, jsonBody: { error: "message too long" } };
    }

    const trimmedHistory = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length <= MAX_MESSAGE_LENGTH,
      )
      .map((m) => ({ role: m.role, content: m.content }));

    if (trimmedHistory.length === 0) {
      return { status: 400, jsonBody: { error: "no valid messages" } };
    }

    const groundingData = await getGroundingData(context);
    if (!groundingData) {
      return { status: 503, jsonBody: { error: "Tournament data is temporarily unavailable, try again shortly." } };
    }

    try {
      const client = getClient();
      const response = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 700,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT + groundingData,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: trimmedHistory,
      });

      const textBlock = response.content.find((b) => b.type === "text");
      return {
        status: 200,
        jsonBody: { reply: textBlock ? textBlock.text : "" },
      };
    } catch (err) {
      context.error("Foundry request failed:", err);
      return { status: 502, jsonBody: { error: "Couldn't reach the tournament assistant, try again shortly." } };
    }
  },
});
