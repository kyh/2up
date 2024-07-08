import type { CxOptions } from "class-variance-authority";
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: CxOptions) => twMerge(cx(inputs));

const getInitials = (name: string) => {
  const [firstName, lastName] = name.split(" ");
  const first = firstName?.charAt(0) ?? "";
  const last = lastName?.charAt(0) ?? "";

  return `${first}${last}`.toUpperCase();
};

const isBrowser = () => {
  return typeof window !== "undefined";
};

export { cn, getInitials, isBrowser };
