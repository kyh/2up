import React, { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

interface NostalgicTextareaProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  label: string;
  containerVariant?: "normal" | "dark";
  inputVariant?: "normal" | "dark";
  spanVariant?:
    | "normal"
    | "success"
    | "primary"
    | "error"
    | "disabled"
    | "warning"
    | "dark";
  id: string;
  placeholder?: string;
}

const containerStyles = cva("mb-3 flex w-full flex-col flex-nowrap text-base", {
  variants: {
    containerVariant: {
      normal: "text-normal-text",
      dark: "bg-dark p-4 text-light",
    },
  },
  defaultVariants: {
    containerVariant: "normal",
  },
});

const inputStyles = cva(
  "min-h-full w-full border-none px-5 py-3 -outline-offset-2 placeholder:text-dark-555",
  {
    variants: {
      inputVariant: {
        normal: "border-normal-border focus:outline-dark",
        dark: "border-light bg-dark focus:outline-light",
      },
    },
    defaultVariants: {
      inputVariant: "normal",
    },
  },
);

const spanStyles = cva("pointer-events-none absolute px-5 py-3", {
  variants: {
    spanVariant: {
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
    spanVariant: "normal",
  },
});

const NostalgicTextarea: React.FC<NostalgicTextareaProps> = ({
  name,
  label,
  containerVariant = "normal",
  inputVariant = "normal",
  spanVariant = "normal",
  id,
  placeholder,
  ...props
}) => {
  return (
    <div {...props} className={containerStyles({ containerVariant })}>
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
          className={inputStyles({ inputVariant })}
        />
        <span
          className={`${spanStyles({ spanVariant })} left-[0px] top-[-4px] h-[calc(100%+8px)] w-[100%] border-y-4`}
        ></span>
        <span
          className={`${spanStyles({ spanVariant })} left-[-4px] top-[0px] h-[100%] w-[calc(100%+8px)] border-x-4`}
        ></span>
      </div>
    </div>
  );
};

export default NostalgicTextarea;
