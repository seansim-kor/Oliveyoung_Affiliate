import { AnalysisResult } from '../types';

const STORAGE_KEY = 'kbeauty_skin_history';

export const saveHistory = (result: AnalysisResult) => {
    const currentHistory = getHistory();
    // Ensure we have a timestamp
    const newEntry = { ...result, timestamp: Date.now() };

    // Prepend new result
    const updatedHistory = [newEntry, ...currentHistory];

    // Limit to last 10 entries to manage storage size
    const limitedHistory = updatedHistory.slice(0, 10);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
};

export const getHistory = (): AnalysisResult[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
};

export const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
};

export const hasHistory = (): boolean => {
    return getHistory().length > 0;
};
