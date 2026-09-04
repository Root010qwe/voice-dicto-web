import { useState } from "react";
import "./App.css";
import { useRecorder } from "./audio/useRecorder";
import { useSettings } from "./settings/useSettings";
import { sttProviders, SttError } from "./stt";
import { enhanceProviders, EnhanceError, resolveSystemPrompt } from "./enhance";
import { addHistoryEntry, clearHistory, loadHistory, type HistoryEntry } from "./storage/history";
import { RecordButton } from "./ui/RecordButton";
import { ResultView, type AppPhase } from "./ui/ResultView";
import { HistoryList } from "./ui/HistoryList";
import { QuickStartPanel } from "./ui/QuickStartPanel";
import { AboutPanel } from "./ui/AboutPanel";

function App() {
  const { settings, update } = useSettings();
  const recorder = useRecorder();
  const [phase, setPhase] = useState<AppPhase>("idle");
  const [rawText, setRawText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());

  const activeApiKey = settings.sttProvider === "groq" ? settings.groqApiKey : settings.geminiApiKey;
  const canRecord = Boolean(activeApiKey);

  const runPipeline = async (blob: Blob) => {
    setErrorMessage(null);
    setRawText("");
    setEnhancedText("");

    try {
      setPhase("transcribing");
      const sttKey = settings.sttProvider === "groq" ? settings.groqApiKey : settings.geminiApiKey;
      const text = await sttProviders[settings.sttProvider].transcribe(blob, sttKey, settings.language);
      setRawText(text);

      if (!text) {
        setErrorMessage("Не удалось распознать речь — попробуйте ещё раз.");
        setPhase("error");
        return;
      }

      if (settings.enhanceProvider === "none") {
        setPhase("done");
        setHistory(addHistoryEntry(history, { rawText: text, enhancedText: "" }));
        return;
      }

      setPhase("enhancing");
      const enhanceKey =
        settings.enhanceProvider === "groq" ? settings.groqApiKey : settings.geminiApiKey;
      const systemPrompt = resolveSystemPrompt(settings.enhanceMode, settings.customPrompt);
      const enhanced = await enhanceProviders[settings.enhanceProvider].enhance(
        text,
        systemPrompt,
        enhanceKey
      );
      setEnhancedText(enhanced);
      setPhase("done");
      setHistory(addHistoryEntry(history, { rawText: text, enhancedText: enhanced }));
    } catch (e) {
      const message =
        e instanceof SttError || e instanceof EnhanceError
          ? e.message
          : "Произошла непредвиденная ошибка. Попробуйте ещё раз.";
      setErrorMessage(message);
      setPhase("error");
    }
  };

  const handleRecordClick = async () => {
    if (recorder.status === "recording") {
      const blob = await recorder.stop();
      if (blob) await runPipeline(blob);
      return;
    }
    if (!canRecord) return;
    setPhase("idle");
    setErrorMessage(null);
    await recorder.start();
    if (recorder.status !== "error") setPhase("recording");
  };

  const handleClearHistory = () => setHistory(clearHistory());
  const handleSelectHistory = (entry: HistoryEntry) => {
    setRawText(entry.rawText);
    setEnhancedText(entry.enhancedText);
    setPhase("done");
  };

  const isBusy = phase === "transcribing" || phase === "enhancing";

  return (
    <div className="layout">
      <QuickStartPanel settings={settings} onChange={update} />

      <div className="app">
        <header className="app-header">
          <h1>Voice Dicto</h1>
        </header>

        <main className="app-main">
          {!canRecord && (
            <p className="app-notice">Ключ API недоступен. Попробуйте обновить страницу позже.</p>
          )}

          <RecordButton
            isRecording={recorder.status === "recording"}
            disabled={isBusy || (!canRecord && recorder.status !== "recording")}
            onClick={handleRecordClick}
          />

          {recorder.error && <p className="app-notice app-notice--error">{recorder.error}</p>}

          <ResultView
            phase={phase}
            rawText={rawText}
            enhancedText={enhancedText}
            errorMessage={errorMessage}
          />

          <HistoryList entries={history} onClear={handleClearHistory} onSelect={handleSelectHistory} />
        </main>

        <footer className="app-footer">
          <p>
            Статичный сайт на GitHub Pages. Работает только пока вкладка открыта — глобального
            системного хоткея, как в нативных приложениях, здесь нет.
          </p>
        </footer>
      </div>

      <AboutPanel />
    </div>
  );
}

export default App;
