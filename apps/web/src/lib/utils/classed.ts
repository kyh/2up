import { createClassed } from "@tw-classed/react";
import { twMerge } from "tailwind-merge";

export { deriveClassed, type ComponentProps } from "@tw-classed/react";

export const { classed } = createClassed({ merger: twMerge });
