import { classed } from "@tw-classed/react";
import { theme } from "~/styles/theme";

export const Card = classed.div(
  "flex flex-col p-8",
  "[border-image-slice:4_4_3_5_fill]",
  "[border-image-width:5px]",
  "[border-image-outset:0]",
  "[border-image-repeat:stretch_stretch]",
  `[border-image-source:${theme.ui.cardBorderUrl}]`, {
  variants: {
    background: {
      true: "bg-white dark:bg-inherit",
      false: "bg-transparent"
    }
  },
  defaultVariants: {
    background: "false"
  }
}
);

