import { useState } from "react";

export type AppPhase = "idle" | "recording" | "transcribing" | "enhancing" | "done" | "error";

interface Props {
  phase: AppPhase;
  rawText: string;
  enhancedText: string;
  errorMessage: string | null;
}

const PHASE_LABEL: Record<AppPhase, string> = {
  idle: "",
  recording: "Слушаю…",
  transcribing: "Распознаю речь…",
  enhancing: "Обрабатываю текст…",
  done: "",
  error: "",
};

export function ResultView({ phase, rawText, enhancedText, errorMessage }: Props) {
  const [copied, setCopied] = useState(false);
  const displayText = enhancedText || rawText;

  const handleCopy = async () => {
    if (!displayText) return;
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API may be unavailable — user can select text manually
    }
  };

  if (phase === "error" && errorMessage) {
    return <div className="result-view result-view--error">{errorMessage}</div>;
  }

  if (PHASE_LABEL[phase]) {
    return (
      <div className="result-view result-view--status">
        <span className="spinner" aria-hidden="true" />
        {PHASE_LABEL[phase]}
      </div>
    );
  }

  if (!displayText) {
    return (
      <div className="result-view result-view--placeholder">
        Нажмите «Начать запись» и продиктуйте текст.
      </div>
    );
  }

  return (
    <div className="result-view">
      <p className="result-view__text">{displayText}</p>
      {rawText && enhancedText && rawText !== enhancedText && (
        <details className="result-view__raw">
          <summary>Показать сырую расшифровку</summary>
          <p>{rawText}</p>
        </details>
      )}
      <button type="button" className="copy-button" onClick={handleCopy}>
        {copied ? "Скопировано ✓" : "Скопировать"}
      </button>
    </div>
  );
}
