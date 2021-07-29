const getItem = (key: string) => {
  if (typeof window !== "undefined" && window.localStorage) {
    const value = window.localStorage.getItem(key);
    try {
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return value;
    }
  }
};

const setItem = (key: string, value: any) => {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  }
};

const removeItem = (key: string) => {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage.removeItem(key);
  }
};

export const localStorage = {
  getItem,
  setItem,
  removeItem,
};
