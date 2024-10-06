import type { VariantProps } from "class-variance-authority";
import React from "react";
import { cva } from "class-variance-authority";

import { Borders } from "./borders";

const progressStyles = cva("h-10", {
  variants: {
    variant: {
      normal: "bg-dark",
      primary: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-error",
      pattern: "bg-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

type ProgressProps = VariantProps<typeof progressStyles> &
  React.HTMLAttributes<HTMLDivElement> & {
    percent: number;
  };

export const Progress = ({ variant, percent, ...props }: ProgressProps) => {
  const classes = progressStyles({ variant });

  const patternStyle = {
    backgroundImage:
      "linear-gradient(90deg, rgb(51, 51, 51) 10px, white 10px), linear-gradient(90deg, white 10px, rgb(51, 51, 51) 10px), linear-gradient(90deg, rgb(51, 51, 51) 10px, white 10px),linear-gradient(90deg, white 10px, rgb(51, 51, 51) 10px)",
    backgroundPosition: "0 0, 0 10px, 0 20px, 0 30px",
    backgroundRepeat: "repeat-x",
    backgroundSize: "20px 10px, 20px 10px,20px 10px,20px 10px",
    width: percent + "%",
  };

  return (
    <div {...props} className="relative w-full p-1">
      <Borders />
      <div
        className={classes}
        style={variant === "pattern" ? patternStyle : { width: `${percent}%` }}
      />
    </div>
  );
};
