import type { SttProvider } from "./sttProvider";
import { SttError } from "./sttProvider";

function extensionForMime(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  if (mime.includes("wav")) return "wav";
  return "webm";
}

export const groqSttProvider: SttProvider = {
  id: "groq",
  label: "Groq (whisper-large-v3-turbo)",
  async transcribe(audioBlob, apiKey, language) {
    if (!apiKey) throw new SttError("Не задан ключ Groq API");

    const form = new FormData();
    const ext = extensionForMime(audioBlob.type);
    form.append("file", audioBlob, `recording.${ext}`);
    form.append("model", "whisper-large-v3-turbo");
    if (language) form.append("language", language);
    form.append("response_format", "json");

    let res: Response;
    try {
      res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });
    } catch (e) {
      throw new SttError(
        "Не удалось связаться с Groq API (возможно, CORS или сеть). Попробуйте провайдер Gemini.",
        e
      );
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new SttError(`Groq STT вернул ошибку ${res.status}: ${text}`);
    }

    const data = (await res.json()) as { text?: string };
    return (data.text ?? "").trim();
  },
};
