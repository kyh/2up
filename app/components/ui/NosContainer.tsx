import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import CornerShapes from "./Corners";

const containerStyles = cva("", {
  variants: {
    variant: {
      normal: "border-dark bg-light text-dark",
      dark: "border-light bg-dark text-light",
    },
  },
  defaultVariants: {
    variant: "normal",
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
  const classes = containerStyles({ variant });

  return (
    <div className={clsx(classes, rounded && `p-1`)}>
      <div
        {...props}
        className={clsx(
          classes,
          rounded ? "" : "border-4",
          heading ? "pt-10" : "py-5",
          centered ? "text-center" : "text-left",
          "relative m-1 box-border flex  flex-wrap gap-5 p-6",
        )}
      >
        {rounded &&
          (variant === "dark" ? (
            <CornerShapes type="dark" />
          ) : (
            <CornerShapes type="normal" />
          ))}

        {heading && (
          <span
            className={clsx(
              centered ? `left-1/2 -translate-x-1/2` : `left-1 sm:left-10`,
              variant === "dark" ? `bg-dark text-light` : `bg-light text-dark`,
              `absolute top-[-6px] px-2`,
            )}
          >
            {heading}
          </span>
        )}
        {children}
      </div>
    </div>
  );
};
