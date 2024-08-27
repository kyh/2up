import React, { HTMLAttributes } from "react";
import { Slot, SlotProps } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";

interface TextProps
  extends HTMLAttributes<HTMLSpanElement | SlotProps>,
    VariantProps<typeof textStyles> {
  variant?: "success" | "primary" | "error" | "disabled" | "warning";
  asChild?: boolean;
}

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

const Text: React.FC<TextProps> = ({
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

export default Text;
