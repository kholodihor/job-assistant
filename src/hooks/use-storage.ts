export const useStorage = () => {
  // Storage utilities
  const getStorageData = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const setStorageData = <T>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const removeStorageData = (key: string): void => {
    localStorage.removeItem(key);
  };

  return {
    getStorageData,
    setStorageData,
    removeStorageData,
  };
};
