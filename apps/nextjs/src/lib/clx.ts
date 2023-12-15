import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const clx = (...args: ClassValue[]) => twMerge(clsx(...args));
