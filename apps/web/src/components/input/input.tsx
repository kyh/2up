import { classed } from "@/lib/utils/classed";

export const Input = classed.input(
  "leading-8 text-black dark:text-white bg-white dark:bg-black",
  "focus:outline-none",
  "read-only:brightness-50 read-only:cursor-not-allowed",
  // Temprory border for both default and rounded variants
  "border-2 border-grey-dark dark:border-grey-light rounded-wavy",
  {
    variants: {
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
      variant: {
        default: "px-4",
        rounded: "py-4 px-6",
      },
    },
    defaultVariants: {
      fullWidth: "false",
      variant: "default",
    },
  },
);
