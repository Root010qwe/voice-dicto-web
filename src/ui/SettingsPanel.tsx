import type { Settings } from "../settings/useSettings";
import { ENHANCE_MODES } from "../enhance/prompts";

interface Props {
  settings: Settings;
  onChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  onClearKeys: () => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onChange, onClearKeys, onClose }: Props) {
  return (
    <div className="settings-panel">
      <div className="settings-panel__header">
        <h2>Настройки</h2>
        <button type="button" className="icon-button" onClick={onClose} aria-label="Закрыть">
          ×
        </button>
      </div>

      <section className="settings-section">
        <h3>Распознавание речи (STT)</h3>
        <label className="field">
          <span>Провайдер</span>
          <select
            value={settings.sttProvider}
            onChange={(e) => onChange("sttProvider", e.target.value as Settings["sttProvider"])}
          >
            <option value="groq">Groq — whisper-large-v3-turbo (быстро)</option>
            <option value="gemini">Google Gemini (запасной)</option>
          </select>
        </label>
      </section>

      <section className="settings-section">
        <h3>Очистка текста (Enhance)</h3>
        <label className="field">
          <span>Провайдер</span>
          <select
            value={settings.enhanceProvider}
            onChange={(e) => onChange("enhanceProvider", e.target.value as Settings["enhanceProvider"])}
          >
            <option value="groq">Groq — openai/gpt-oss-20b</option>
            <option value="gemini">Google Gemini (запасной)</option>
            <option value="none">Выключить (показывать сырой текст)</option>
          </select>
        </label>

        <label className="field">
          <span>Режим</span>
          <select
            value={settings.enhanceMode}
            onChange={(e) => onChange("enhanceMode", e.target.value as Settings["enhanceMode"])}
          >
            {Object.values(ENHANCE_MODES).map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
            <option value="custom">Свой промпт</option>
          </select>
        </label>

        {settings.enhanceMode === "custom" && (
          <label className="field">
            <span>Свой промпт</span>
            <textarea
              rows={4}
              placeholder="Например: перепиши текст в виде вежливого письма коллеге, сохрани все факты"
              value={settings.customPrompt}
              onChange={(e) => onChange("customPrompt", e.target.value)}
            />
          </label>
        )}
      </section>

      <section className="settings-section">
        <h3>API-ключи</h3>
        <p className="settings-hint">
          Ключи хранятся только в localStorage вашего браузера и уходят напрямую с вашего браузера
          к провайдеру. Они никогда не попадают в код сайта и не видны другим посетителям.
        </p>
        <label className="field">
          <span>Groq API key</span>
          <input
            type="password"
            autoComplete="off"
            placeholder="gsk_..."
            value={settings.groqApiKey}
            onChange={(e) => onChange("groqApiKey", e.target.value)}
          />
        </label>
        <label className="field">
          <span>Google AI Studio (Gemini) API key</span>
          <input
            type="password"
            autoComplete="off"
            placeholder="AIza..."
            value={settings.geminiApiKey}
            onChange={(e) => onChange("geminiApiKey", e.target.value)}
          />
        </label>
        <button type="button" className="link-button" onClick={onClearKeys}>
          Очистить сохранённые ключи
        </button>
      </section>

      <section className="settings-section">
        <h3>Получить бесплатный ключ</h3>
        <ul className="link-list">
          <li>
            Groq:{" "}
            <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">
              console.groq.com/keys
            </a>
          </li>
          <li>
            Gemini:{" "}
            <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">
              aistudio.google.com/app/apikey
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
