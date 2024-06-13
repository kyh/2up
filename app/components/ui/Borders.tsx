import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const borders = cva("pointer-events-none absolute px-3 py-2", {
  variants: {
    variant: {
      normal: "border-normal",
      success: "border-success",
      primary: "border-primary",
      error: "border-error",
      disabled: "border-disabled",
      warning: "border-warning",
    },
    position: {
      top: "left-0 top-[-4px] h-[calc(100%+8px)] w-full border-y-4",
      left: "left-[-4px] top-0 h-full w-[calc(100%+8px)] border-x-4",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

interface BordersProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof borders> {
  className?: string;
}

const Borders: React.FC<BordersProps> = ({ variant, className, ...props }) => {
  return (
    <>
      <span
        className={borders({ variant, position: "top", className })}
        {...props}
      ></span>
      <span
        className={borders({ variant, position: "left", className })}
        {...props}
      ></span>
    </>
  );
};

export default Borders;
