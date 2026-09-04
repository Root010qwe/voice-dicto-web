import type { EnhanceProvider } from "./enhanceProvider";
import { EnhanceError } from "./enhanceProvider";

const MODEL = "gemini-2.0-flash";

export const geminiEnhanceProvider: EnhanceProvider = {
  id: "gemini",
  label: "Google Gemini (gemini-2.0-flash)",
  async enhance(rawText, systemPrompt, apiKey) {
    if (!apiKey) throw new EnhanceError("Не задан ключ Google AI Studio (Gemini)");

    const body = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: rawText }] }],
      generationConfig: { temperature: 0.2 },
    };

    let res: Response;
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
    } catch (e) {
      throw new EnhanceError("Не удалось связаться с Gemini API (сеть).", e);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new EnhanceError(`Gemini Enhance вернул ошибку ${res.status}: ${text}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return String(text).trim();
  },
};
