import type { Settings } from "../settings/useSettings";
import { ENHANCE_MODES, type EnhanceModeId } from "../enhance/prompts";

interface Props {
  settings: Settings;
  onChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

const STYLE_OPTIONS: { id: EnhanceModeId; label: string }[] = [
  { id: ENHANCE_MODES.clean.id, label: ENHANCE_MODES.clean.label },
  { id: ENHANCE_MODES.business.id, label: ENHANCE_MODES.business.label },
  { id: ENHANCE_MODES.notes.id, label: ENHANCE_MODES.notes.label },
  { id: "custom", label: "Свой промпт" },
];

export function QuickStartPanel({ settings, onChange }: Props) {
  return (
    <aside className="side-panel side-panel--left">
      <h2>Быстрый старт</h2>
      <ol className="steps-list">
        <li>Нажмите «Начать запись» и продиктуйте текст — ключ уже встроен, ничего вводить не нужно.</li>
        <li>Нажмите ещё раз, чтобы остановить.</li>
        <li>Дождитесь обработки и скопируйте готовый текст.</li>
      </ol>

      <h2>Стиль оформления</h2>
      <div className="style-pills">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`style-pill${settings.enhanceMode === opt.id ? " style-pill--active" : ""}`}
            onClick={() => onChange("enhanceMode", opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {settings.enhanceMode === "custom" && (
        <textarea
          className="style-custom-prompt"
          rows={4}
          placeholder="Например: перепиши текст в виде вежливого письма коллеге, сохрани все факты"
          value={settings.customPrompt}
          onChange={(e) => onChange("customPrompt", e.target.value)}
        />
      )}
    </aside>
  );
}
