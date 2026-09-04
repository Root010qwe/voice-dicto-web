import type { EnhanceProvider, EnhanceProviderId } from "./enhanceProvider";
import { groqEnhanceProvider } from "./groqEnhanceProvider";
import { geminiEnhanceProvider } from "./geminiEnhanceProvider";

export const enhanceProviders: Record<Exclude<EnhanceProviderId, "none">, EnhanceProvider> = {
  groq: groqEnhanceProvider,
  gemini: geminiEnhanceProvider,
};

export * from "./enhanceProvider";
export * from "./prompts";
