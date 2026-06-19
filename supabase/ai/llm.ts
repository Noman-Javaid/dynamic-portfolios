import "server-only";

const DEFAULT_BASE_URL = "https://api.groq.com/openai/v1";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export function isLLMConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export async function chatJSON(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to supabase/.env and restart the dev server."
    );
  }

  const baseUrl = process.env.GROQ_BASE_URL || DEFAULT_BASE_URL;

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages,
      }),
    });
  } catch (err) {
    throw new Error(
      `Could not reach the LLM API: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LLM API error (${res.status}): ${detail.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("The LLM returned an empty response.");
  }
  return content;
}
