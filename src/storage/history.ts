export interface HistoryEntry {
  id: string;
  createdAt: number;
  rawText: string;
  enhancedText: string;
}

const STORAGE_KEY = "voice-dicto:history";
const MAX_ENTRIES = 50;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // ignore quota/private-mode errors
  }
}

export function addHistoryEntry(
  entries: HistoryEntry[],
  entry: Omit<HistoryEntry, "id" | "createdAt">
): HistoryEntry[] {
  const next: HistoryEntry = { ...entry, id: crypto.randomUUID(), createdAt: Date.now() };
  const updated = [next, ...entries].slice(0, MAX_ENTRIES);
  saveHistory(updated);
  return updated;
}

export function clearHistory(): HistoryEntry[] {
  saveHistory([]);
  return [];
}
