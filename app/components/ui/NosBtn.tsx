import React, { ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface NosBtnProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  block?: boolean;
  className?: string;
}

const buttonStyles = cva("relative m-2 px-3 py-3 text-base capitalize", {
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
});

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
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

export const NosBtn = ({
  block,
  variant,
  className,
  children,
  ...props
}: NosBtnProps) => {
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
          " left-[0px] top-[-4px] h-[calc(100%+8px)] w-[100%] border-y-4"
        }
      ></span>
      <span
        className={
          spanStyles({ variant }) +
          " left-[-4px] top-[0px] h-[100%] w-[calc(100%+8px)] border-x-4"
        }
      ></span>
    </>
  );

  return variant === "file" ? (
    <label
      className={`${commonProps.className} shadow-[inset_-4px_-4px] hover:shadow-[inset_-6px_-6px] focus:outline focus:outline-[6px] active:shadow-[inset_6px_6px]`}
    >
      {renderSpan(variant)}
      <input type="file" className="pointer-events-none absolute opacity-0" />
      {children}
    </label>
  ) : (
    <button
      type="button"
      {...commonProps}
      className={`${commonProps.className} shadow-[inset_-4px_-4px] ${variant !== "disabled" && "hover:shadow-[inset_-6px_-6px] focus:outline focus:outline-[6px] active:shadow-[inset_6px_6px]"}`}
    >
      {renderSpan(variant!)}
      {children}
    </button>
  );
};
