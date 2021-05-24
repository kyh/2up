import { memoize, omit } from "lodash";

const hashCodeFn = (string?: string, mod?: number) => {
  let hash = 0;
  if (!string || string.length === 0) return hash;
  for (let i = 0; i < string.length; i++) {
    let chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  if (mod) return Math.abs(hash % mod);
  return hash;
};

export const hashCode = memoize(hashCodeFn);

export const generateUuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const omitDeep = (input: any, ...props: string[]) => {
  const omitDeepOnOwnProps = (obj = {}): any => {
    if (typeof input === "undefined") return input;
    if (!Array.isArray(obj) && !isObject(obj)) return obj;
    if (Array.isArray(obj)) return omitDeep(obj, ...props);

    const o: any = {};
    for (const [key, value] of Object.entries(obj)) {
      o[key] = !isNil(value) ? omitDeep(value, ...props) : value;
    }

    return omit(o, props);
  };

  if (Array.isArray(input)) return input.map(omitDeepOnOwnProps);
  return omitDeepOnOwnProps(input);
};

const isNil = (value: any) => {
  return value === null || value === undefined;
};

const isObject = (obj = {}) => {
  return Object.prototype.toString.call(obj) === "[object Object]";
};
