import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { Spinner } from "./spinner";
import { cn } from "./utils";

export const buttonVariants = cva(
  "focus-visible:ring-ring relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition focus-visible:ring-1 focus-visible:outline-hidden disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 shadow-xs",
        outline:
          "border-border bg-background hover:bg-accent hover:text-accent-foreground border shadow-xs",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 py-2",
        lg: "h-10 px-8",
        icon: "size-9",
      },
      loading: {
        true: "[&>:first-child]:opacity-100",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        loading: true,
        className: "[&>:first-child]:bg-primary",
      },
      {
        variant: "destructive",
        loading: true,
        className: "[&>:first-child]:bg-destructive",
      },
      {
        variant: "outline",
        loading: true,
        className: "[&>:first-child]:bg-background",
      },
      {
        variant: "secondary",
        loading: true,
        className: "[&>:first-child]:bg-secondary",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = {
  asChild?: boolean;
  loading?: boolean;
} & React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export const Button = ({
  className,
  variant,
  size,
  asChild = false,
  children,
  loading,
  disabled,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, loading, className }))}
      disabled={disabled ?? loading}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 grid place-items-center rounded-full opacity-0 transition">
        <Spinner className="size-4" />
      </span>
      <Slottable>{children}</Slottable>
    </Comp>
  );
};
