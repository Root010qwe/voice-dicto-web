export type EnhanceProviderId = "groq" | "gemini" | "none";

export interface EnhanceProvider {
  id: EnhanceProviderId;
  label: string;
  enhance(rawText: string, systemPrompt: string, apiKey: string): Promise<string>;
}

export class EnhanceError extends Error {
  cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "EnhanceError";
    this.cause = cause;
  }
}
