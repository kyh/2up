import React, { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface TextProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textStyles> {
  variant?: "success" | "primary" | "error" | "disabled" | "warning";
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
  ...props
}) => {
  return (
    <Slot {...props} className={textStyles({ variant })}>
      {children}
    </Slot>
  );
};

export default Text;
