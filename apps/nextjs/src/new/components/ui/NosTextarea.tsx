import React, { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";

const containerStyles = cva("mb-3 flex w-full flex-col flex-nowrap text-base", {
  variants: {
    variant: {
      normal: "text-normal-text",
      dark: "bg-dark p-4 text-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

const inputStyles = cva(
  "min-h-full w-full border-none px-5 py-3 -outline-offset-2 placeholder:text-dark-555",
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

interface NostalgicTextareaProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  label: string;
  variant?: CombinedVariantProps["variant"];
  id: string;
  placeholder?: string;
}

const NostalgicTextarea: React.FC<NostalgicTextareaProps> = ({
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

export default NostalgicTextarea;
