import { classed, deriveClassed } from "~/utils/classed";

export const Card = classed.div(
  "flex flex-col p-8 border-2 border-grey-dark dark:border-grey-light rounded-wavy",
  {
    variants: {
      background: {
        true: "bg-white dark:bg-black",
        false: "bg-transparent",
      },
    },
    defaultVariants: {
      background: "false",
    },
  }
);


