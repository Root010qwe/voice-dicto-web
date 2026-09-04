import type { SttProvider, SttProviderId } from "./sttProvider";
import { groqSttProvider } from "./groqProvider";
import { geminiSttProvider } from "./geminiProvider";

export const sttProviders: Record<SttProviderId, SttProvider> = {
  groq: groqSttProvider,
  gemini: geminiSttProvider,
};

export * from "./sttProvider";
