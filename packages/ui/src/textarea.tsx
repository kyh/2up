import type { VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import React from "react";
import { cva } from "class-variance-authority";

const containerStyles = cva("mb-3 flex w-full flex-col flex-nowrap text-base", {
  variants: {
    variant: {
      normal: "text-normal-text",
      dark: "bg-dark text-light p-4",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

const inputStyles = cva(
  "placeholder:text-dark-555 min-h-full w-full border-none px-5 py-3 -outline-offset-2",
  {
    variants: {
      variant: {
        normal: "border-normal-border focus:outline-dark",
        dark: "border-light bg-dark focus:outline-light",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

const spanStyles = cva("pointer-events-none absolute px-5 py-3", {
  variants: {
    variant: {
      normal: "border-dark",
      success: "border-success",
      primary: "border-primary",
      error: "border-error",
      disabled: "border-disabled",
      warning: "border-warning",
      dark: "border-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

type CombinedVariantProps = VariantProps<typeof containerStyles> &
  VariantProps<typeof inputStyles> &
  VariantProps<typeof spanStyles>;

type TextareaProps = {
  name: string;
  label: string;
  variant?: CombinedVariantProps["variant"];
  id: string;
  placeholder?: string;
} & HTMLAttributes<HTMLDivElement>;

export const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  variant = "normal",
  id,
  placeholder,
  ...props
}) => {
  return (
    <div {...props} className={containerStyles({ variant })}>
      <label
        htmlFor={name}
        className="flex-grow-1 mb-4 mr-6 basis-0 text-left text-base"
      >
        {label}
      </label>
      <div className="relative flex-grow-[5] basis-0">
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          className={inputStyles({ variant })}
        />
        <span
          className={`${spanStyles({ variant })} left-[0px] top-[-4px] h-[calc(100%+8px)] w-[100%] border-y-4`}
        ></span>
        <span
          className={`${spanStyles({ variant })} left-[-4px] top-[0px] h-[100%] w-[calc(100%+8px)] border-x-4`}
        ></span>
      </div>
    </div>
  );
};
