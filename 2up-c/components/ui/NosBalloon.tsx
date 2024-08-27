import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import CornerShapes from "./Corners";

const baseVariations = {
  normal: "border-dark bg-light text-dark",
  dark: "border-light bg-dark text-light",
};

const balloonStyles = cva(
  "relative m-1 mb-5 h-fit w-fit whitespace-break-spaces px-6 py-5 text-base",
  {
    variants: {
      variant: baseVariations,
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

const balloonBaseStyles = cva("", {
  variants: {
    variant: baseVariations,
  },
  defaultVariants: {
    variant: "normal",
  },
});

type BalloonPosition = "left" | "right";

type BalloonProps = VariantProps<typeof balloonStyles> &
  React.HTMLAttributes<HTMLDivElement> & {
    from?: BalloonPosition;
  };

export const Balloon = ({ variant, from = "left", children }: BalloonProps) => {
  const balloonClasses = balloonStyles({ variant });
  const balloonBaseClasses = balloonBaseStyles({ variant });

  return (
    <div className={balloonClasses}>
      {variant === "dark" ? (
        <CornerShapes type="dark" />
      ) : (
        <CornerShapes type="normal" />
      )}

      <span
        className={clsx(
          from === "left" ? `left-10` : `right-10`,
          `absolute bottom-0 h-5 w-7 translate-y-5`,
        )}
      >
        <span
          className={clsx(
            balloonBaseClasses,
            from === "left" ? `left-0` : `right-0`,
            `absolute top-0 h-2 w-7 border-x-4`,
          )}
        ></span>
        <span
          className={clsx(
            balloonBaseClasses,
            from === "left" ? `-left-1` : `-right-1`,
            `absolute top-2 h-1 w-7 border-x-4`,
          )}
        ></span>
        <span
          className={clsx(
            balloonBaseClasses,
            from === "left" ? `-left-2` : `-right-2`,
            `absolute top-3 h-1  w-7 border-x-4`,
          )}
        ></span>
        <span
          className={clsx(
            balloonBaseClasses,
            from === "left" ? `-left-2` : `-right-2`,
            `absolute top-4 h-1  w-6 border-x-4 border-b-4`,
          )}
        ></span>
      </span>

      {children}
    </div>
  );
};
