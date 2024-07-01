import React from "react";
import { cva, VariantProps } from "class-variance-authority";

import CornerShapes from "./Corners";

const containerWrapperStyles = cva("", {
  variants: {
    variant: {
      normal: "border-dark bg-light text-dark",
      dark: "border-light bg-dark text-light",
    },
    rounded: {
      true: "p-1",
      false: "",
    },
  },
  defaultVariants: {
    variant: "normal",
    rounded: false,
  },
});

const containerStyles = cva(
  "relative m-1 box-border flex  flex-wrap gap-5 p-6",
  {
    variants: {
      variant: {
        normal: "border-dark bg-light text-dark",
        dark: "border-light bg-dark text-light",
      },
      rounded: {
        true: "",
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
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

const containerHeadingStyles = cva("absolute top-[-6px] px-2", {
  variants: {
    variant: {
      normal: "bg-light text-dark",
      dark: "bg-dark text-light",
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
  centered = false,
  rounded = false,
  ...props
}: ContainerProps) => {
  const containerWrapperClasses = containerWrapperStyles({ variant, rounded });
  const containerClasses = containerStyles({ variant, rounded, centered });
  const containerHeadingClasses = containerHeadingStyles({
    variant,
    centered,
  });

  return (
    <div className={containerWrapperClasses}>
      <div {...props} className={containerClasses}>
        {rounded &&
          (variant === "dark" ? (
            <CornerShapes type="dark" />
          ) : (
            <CornerShapes type="normal" />
          ))}
        {heading && <span className={containerHeadingClasses}>{heading}</span>}
        {children}
      </div>
    </div>
  );
};
