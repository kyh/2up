const mockLocation = {
  origin: "https://playhouse.gg",
  href: "https://playhouse.gg",
  protocol: "https:",
  host: "playhouse.gg",
  hostname: "playhouse.gg",
  port: "",
  pathname: "",
  search: "",
  hash: "",
};

export const location =
  typeof window !== "undefined" ? window.location : mockLocation;

export const localStorage = {
  getItem: (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      const value = window.localStorage.getItem(key);
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    }
  },
  setItem: (key: string, value: any) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.setItem(key, JSON.stringify(value));
    }
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.removeItem(key);
    }
  },
};
