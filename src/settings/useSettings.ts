import { useCallback, useEffect, useState } from "react";
import type { SttProviderId } from "../stt/sttProvider";
import type { EnhanceProviderId } from "../enhance/enhanceProvider";
import type { EnhanceModeId } from "../enhance/prompts";

export interface Settings {
  sttProvider: SttProviderId;
  enhanceProvider: EnhanceProviderId;
  groqApiKey: string;
  geminiApiKey: string;
  language: string;
  enhanceMode: EnhanceModeId;
  customPrompt: string;
}

const DEFAULT_SETTINGS: Settings = {
  sttProvider: "groq",
  enhanceProvider: "groq",
  groqApiKey: "",
  geminiApiKey: "",
  language: "ru",
  enhanceMode: "clean",
  customPrompt: "",
};

const STORAGE_KEY = "voice-dicto:settings";

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage may be unavailable (private mode) — settings just won't persist
    }
  }, [settings]);

  const update = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearKeys = useCallback(() => {
    setSettings((prev) => ({ ...prev, groqApiKey: "", geminiApiKey: "" }));
  }, []);

  return { settings, update, clearKeys };
}
