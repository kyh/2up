import React, { ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconButtonStyles = cva(
  "relative flex items-center justify-center rounded-full",
  {
    variants: {
      variant: {
        normal:
          "border-normal-border bg-normal text-normal-text shadow-normal-shadow hover:bg-normal-hover hover:shadow-normal-shadow focus:outline-normal-outline active:shadow-normal-shadow",
        success:
          "border-success-border bg-success text-success-text shadow-success-shadow hover:bg-success-hover hover:shadow-success-shadow focus:outline-success-outline active:shadow-success-shadow",
        primary:
          "border-primary-border bg-primary text-primary-text shadow-primary-shadow hover:bg-primary-hover hover:shadow-primary-shadow focus:outline-primary-outline active:shadow-primary-shadow",
        error:
          "border-error-border bg-error text-error-text shadow-error-shadow hover:bg-error-hover hover:shadow-error-shadow focus:outline-error-outline active:shadow-error-shadow",
        disabled:
          "cursor-not-allowed border-disabled-border bg-disabled text-disabled-text shadow-disabled-shadow",
        warning:
          "border-warning-border bg-warning text-warning-text shadow-warning-shadow hover:bg-warning-hover hover:shadow-warning-shadow focus:outline-warning-outline active:shadow-warning-shadow",
        file: "border-normal-border bg-normal text-normal-text shadow-normal-shadow hover:bg-normal-hover hover:shadow-normal-shadow focus:outline-normal-outline active:shadow-normal-shadow",
        transparent:
          "bg-transparent hover:bg-normal-hover hover:shadow-normal-shadow focus:outline-normal-outline active:shadow-normal-shadow",
      },
      size: {
        default: "size-10 text-sm",
        sm: "size-8",
        lg: "size-12",
      },
    },
    defaultVariants: {
      variant: "normal",
      size: "default",
    },
  },
);

interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonStyles> {
  icon: React.ReactNode;
}

export const IconButton = ({
  variant,
  className,
  icon,
  ...props
}: IconButtonProps) => {
  const classes = iconButtonStyles({ variant });

  return (
    <button type="button" {...props} className={cn(classes, className)}>
      {icon}
    </button>
  );
};
