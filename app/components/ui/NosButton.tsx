import React, { ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  block?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const buttonStyles = cva(
  "capitalize' relative m-2 flex gap-2 px-3 py-3 text-base",
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
        ghost:
          "m-0 !shadow-none hover:rounded-lg hover:bg-gray-100 hover:opacity-80 hover:shadow-none",
        link: "m-0 !shadow-none hover:rounded-lg hover:bg-gray-100 hover:opacity-80 hover:shadow-none",
      },
      block: {
        true: "mb-6 block whitespace-break-spaces break-words",
        false: "",
      },
    },
    defaultVariants: {
      variant: "normal",
      block: false,
    },
  },
);

const spanStyles = cva("pointer-events-none absolute", {
  variants: {
    variant: {
      normal: "border-normal-border",
      success: "border-success-border",
      primary: "border-primary-border",
      error: "border-error-border",
      disabled: "border-disabled-border",
      warning: "border-warning-border",
      file: "border-normal-border",
      ghost: "border-none",
      link: "border-none",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

export const Button = ({
  block,
  variant,
  className,
  children,
  leftIcon,
  rightIcon,
  ...props
}: ButtonProps) => {
  const commonProps = {
    className:
      buttonStyles({ variant, block }) + (className ? ` ${className}` : ""),
    ...props,
  };

  const renderSpan = (variant: VariantProps<typeof spanStyles>["variant"]) => (
    <>
      <span
        className={
          spanStyles({ variant }) +
          " left-[0rem] top-[-0.25rem] h-[calc(100%+.5rem)] w-[100%] border-y-4"
        }
      ></span>
      <span
        className={
          spanStyles({ variant }) +
          " left-[-0.25rem] top-[0rem] h-[100%] w-[calc(100%+.5rem)] border-x-4"
        }
      ></span>
    </>
  );

  return variant === "file" ? (
    <label
      className={`${commonProps.className} shadow-[inset_-0.25rem_-0.25rem] hover:shadow-[inset_-0.375rem_-0.375rem] focus:outline focus:outline-[.375rem] active:shadow-[inset_.375rem_.375rem]`}
    >
      {renderSpan(variant)}
      <input type="file" className="pointer-events-none absolute opacity-0" />
      {children}
    </label>
  ) : (
    <button
      type="button"
      {...commonProps}
      className={`shadow-[inset_-0.25rem_-0.25rem] ${variant !== "disabled" && "hover:shadow-[inset_-0.375rem_-0.375rem] focus:outline focus:outline-[.375rem] active:shadow-[inset_.375rem_.375rem]"} ${commonProps.className}`}
    >
      {renderSpan(variant!)}
      {leftIcon && leftIcon}
      {children}
      {rightIcon && rightIcon}
    </button>
  );
};
