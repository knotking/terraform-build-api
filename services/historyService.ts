import { GenerationResult } from '../types';

const STORAGE_KEY = 'terraforge_history_v1';

export const getHistory = (): GenerationResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load history", e);
    return [];
  }
};

export const saveToHistory = (item: Omit<GenerationResult, 'id' | 'timestamp'>) => {
  try {
    const history = getHistory();
    const newItem: GenerationResult = {
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: Date.now(),
    };
    // Keep the last 50 items
    const updated = [newItem, ...history].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error("Failed to save history", e);
  }
};

export const deleteHistoryItem = (id: string) => {
  try {
    const history = getHistory();
    const updated = history.filter(h => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to delete history item", e);
    return [];
  }
};

export const clearAllHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};