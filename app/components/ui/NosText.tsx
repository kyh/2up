import React, { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface TextProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof textStyles> {
  type?: "success" | "primary" | "error" | "disabled" | "warning";
}

const textStyles = cva("text-base", {
  variants: {
    type: {
      success: "text-success",
      primary: "text-primary",
      error: "text-error",
      disabled: "text-disabled",
      warning: "text-warning",
    },
  },
  defaultVariants: {
    type: "primary",
  },
});

const Text: React.FC<TextProps> = ({
  type = "primary",
  children,
  ...props
}) => {
  return (
    <div {...props} className={textStyles({ type })}>
      {children}
    </div>
  );
};

export default Text;
