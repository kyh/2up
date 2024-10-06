import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import type { SlotProps } from "@radix-ui/react-slot";

type TextProps = {
  variant?: "success" | "primary" | "error" | "disabled" | "warning";
  asChild?: boolean;
} & HTMLAttributes<HTMLSpanElement | SlotProps> &
  VariantProps<typeof textStyles>;

const textStyles = cva("text-base", {
  variants: {
    variant: {
      success: "text-success",
      primary: "text-primary",
      error: "text-error",
      disabled: "text-disabled",
      warning: "text-warning",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export const Text: React.FC<TextProps> = ({
  variant = "primary",
  children,
  asChild,
  ...props
}) => {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp {...props} className={textStyles({ variant })}>
      {children}
    </Comp>
  );
};
