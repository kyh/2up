import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const badgeVariantStyles = cva("relative cursor-pointer p-1 text-center", {
  variants: {
    variant: {
      dark: "bg-dark text-light",
      primary: "bg-primary text-primary-text",
      success: "bg-success text-success-text",
      warning: "bg-warning text-warning-text",
      error: "bg-error text-error-text",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

const badgeSizeStyles = cva("", {
  variants: {
    size: {
      small: "text-[9px]",
      medium: "text-sm",
      normal: "text-base",
    },
  },
  defaultVariants: {
    size: "normal",
  },
});

const borderStyles = cva(
  "absolute top-1/2 box-content h-1/2 w-full -translate-y-1/2",
  {
    variants: {
      variant: {
        dark: "border-dark",
        primary: "border-primary",
        success: "border-success",
        warning: "border-warning",
        error: "border-error",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

export type BadgeStyleProps = VariantProps<typeof badgeVariantStyles> &
  VariantProps<typeof badgeSizeStyles>;

export interface BadgeProps extends BadgeStyleProps {
  label: React.ReactNode;
  label2?: React.ReactNode;
  variant2?: BadgeStyleProps["variant"];
}

export const Badge = ({
  size,
  variant,
  variant2,
  label,
  label2,
}: BadgeProps) => {
  const variantClasses = badgeVariantStyles({ variant });
  const variantClasses2 = badgeVariantStyles({ variant: variant2 });
  const sizeClasses = badgeSizeStyles({ size });
  const borderClass = borderStyles({ variant });
  const borderClass2 = borderStyles({ variant: variant2 });

  return (
    <div className={sizeClasses}>
      {!label2 ? (
        <div
          className={clsx(
            variantClasses,
            size === "normal" || !size
              ? "mx-2 min-w-[10em]"
              : "x-1 min-h-[20px] w-fit min-w-[20px]",
          )}
        >
          <span
            className={clsx(
              borderClass,
              size === "normal" || !size
                ? "-left-2 border-x-8"
                : "-left-1 border-x-4",
              "absolute top-1/2 box-content h-1/2 w-full -translate-y-1/2 border-dark",
            )}
          />
          {label}
        </div>
      ) : (
        <div
          className={clsx(
            size === "normal" || !size ? "mx-2 min-w-[5em]" : "mx-1 w-fit",
            "flex",
          )}
        >
          <div className={clsx(variantClasses, "flex-1")}>
            <span
              className={clsx(
                borderClass,
                size === "normal" || !size
                  ? "-left-2 border-l-8"
                  : "-left-1 border-l-4",
                "absolute top-1/2 box-content h-1/2 w-full -translate-y-1/2 border-dark",
              )}
            />
            {label}
          </div>

          <div className={clsx(variantClasses2, "flex-1")}>
            <span
              className={clsx(
                borderClass2,
                size === "normal" || !size
                  ? "-right-2 border-r-8"
                  : "-right-1 border-r-4",
                "absolute top-1/2 box-content h-1/2 w-full -translate-y-1/2 border-dark",
              )}
            />
            {label2}
          </div>
        </div>
      )}
    </div>
  );
};
