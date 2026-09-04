import type { SttProvider } from "./sttProvider";
import { SttError } from "./sttProvider";
import { blobToBase64 } from "../lib/blob";

const MODEL = "gemini-2.0-flash";

export const geminiSttProvider: SttProvider = {
  id: "gemini",
  label: "Google Gemini (аудио-инпут)",
  async transcribe(audioBlob, apiKey, language) {
    if (!apiKey) throw new SttError("Не задан ключ Google AI Studio (Gemini)");

    const base64 = await blobToBase64(audioBlob);
    const langHint = language === "ru" ? "русском" : language;

    const body = {
      contents: [
        {
          parts: [
            { inline_data: { mime_type: audioBlob.type || "audio/webm", data: base64 } },
            {
              text: `Расшифруй эту аудиозапись дословно на ${langHint} языке. Верни ТОЛЬКО текст расшифровки без каких-либо комментариев, пояснений или кавычек.`,
            },
          ],
        },
      ],
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
      throw new SttError("Не удалось связаться с Gemini API (сеть).", e);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new SttError(`Gemini STT вернул ошибку ${res.status}: ${text}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return String(text).trim();
  },
};
