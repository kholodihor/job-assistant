export const getStorageData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
};

export const setStorageData = <T>(key: string, data: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeStorageData = (key: string): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};

const storage = { getStorageData, setStorageData, removeStorageData };

export const useStorage = () => storage;
