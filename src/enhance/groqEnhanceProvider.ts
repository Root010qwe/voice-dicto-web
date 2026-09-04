import type { EnhanceProvider } from "./enhanceProvider";
import { EnhanceError } from "./enhanceProvider";

export const groqEnhanceProvider: EnhanceProvider = {
  id: "groq",
  label: "Groq (llama-3.1-8b-instant)",
  async enhance(rawText, systemPrompt, apiKey) {
    if (!apiKey) throw new EnhanceError("Не задан ключ Groq API");

    let res: Response;
    try {
      res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.2,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: rawText },
          ],
        }),
      });
    } catch (e) {
      throw new EnhanceError(
        "Не удалось связаться с Groq API (возможно, CORS или сеть). Попробуйте провайдер Gemini.",
        e
      );
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new EnhanceError(`Groq Enhance вернул ошибку ${res.status}: ${text}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    return String(content).trim();
  },
};
