import type { HistoryEntry } from "../storage/history";

interface Props {
  entries: HistoryEntry[];
  onClear: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

export function HistoryList({ entries, onClear, onSelect }: Props) {
  if (entries.length === 0) return null;

  return (
    <div className="history-list">
      <div className="history-list__header">
        <h3>История сессии</h3>
        <button type="button" className="link-button" onClick={onClear}>
          Очистить
        </button>
      </div>
      <ul>
        {entries.map((entry) => (
          <li key={entry.id}>
            <button type="button" className="history-item" onClick={() => onSelect(entry)}>
              <span className="history-item__time">
                {new Date(entry.createdAt).toLocaleTimeString()}
              </span>
              <span className="history-item__text">
                {(entry.enhancedText || entry.rawText).slice(0, 80)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
