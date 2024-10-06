import type { VariantProps } from "class-variance-authority";
import React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { CornerShapes } from "./corners";

const containerStyles = cva(
  "relative m-1 box-border flex flex-wrap gap-5 p-6",
  {
    variants: {
      variant: {
        normal: "bg-light text-dark",
        dark: "bg-dark text-light",
        transparent: "text-dark bg-transparent p-0",
      },
      rounded: {
        true: "rounded-2xl",
        false: "border-4",
      },
      heading: {
        true: "pt-10",
        false: "py-5",
      },
      centered: {
        true: "text-center",
        false: "text-left",
      },
      bordered: {
        true: "",
        false: "border-none",
      },
    },
    compoundVariants: [
      {
        variant: "normal",
        bordered: true,
        className: "border-dark",
      },
      {
        variant: "dark",
        bordered: true,
        className: "border-light",
      },
    ],
    defaultVariants: {
      variant: "normal",
      bordered: false,
      rounded: false,
    },
  },
);

const containerHeadingStyles = cva("absolute top-[-6px] px-2", {
  variants: {
    variant: {
      normal: "bg-light text-dark",
      dark: "bg-dark text-light",
      transparent: "",
    },
    centered: {
      true: "left-1/2 -translate-x-1/2",
      false: "left-1 sm:left-10",
    },
  },
  defaultVariants: {
    variant: "normal",
    centered: false,
  },
});

type ContainerProps = VariantProps<typeof containerStyles> &
  React.HTMLAttributes<HTMLDivElement> & {
    heading?: string;
    centered?: boolean;
    rounded?: boolean;
  };

export const Container = ({
  variant,
  heading,
  children,
  className,
  bordered = false,
  rounded = false,
  centered = false,
  ...props
}: ContainerProps) => {
  const containerClasses = containerStyles({ variant, rounded, centered });
  const containerHeadingClasses = containerHeadingStyles({
    variant,
    centered,
  });

  return (
    <div {...props} className={cn(containerClasses, className)}>
      {bordered && rounded && (
        <>
          {variant === "dark" ? (
            <CornerShapes type="dark" />
          ) : (
            <CornerShapes type="normal" />
          )}
        </>
      )}
      {heading && <span className={containerHeadingClasses}>{heading}</span>}
      {children}
    </div>
  );
};
