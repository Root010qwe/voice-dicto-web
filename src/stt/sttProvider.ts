export type SttProviderId = "groq" | "gemini";

export interface SttProvider {
  id: SttProviderId;
  label: string;
  transcribe(audioBlob: Blob, apiKey: string, language: string): Promise<string>;
}

export class SttError extends Error {
  cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "SttError";
    this.cause = cause;
  }
}
