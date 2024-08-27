"use client";

import React, { useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import { cn } from "@/lib/utils";
import Borders from "./Borders";

const selectContainerStyles = cva("", {
  variants: {
    variant: {
      normal: "text-dark-999",
      light: "text-light",
      success: "text-dark-999",
      primary: "text-dark-999",
      error: "text-dark-999",
      disabled: "text-dark-999",
      warning: "text-dark-999",
      dark: "text-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

const selectLabelStyles = cva("", {
  variants: {
    variant: {
      normal: "text-normal-text",
      light: "text-normal-text",
      success: "text-normal-text",
      primary: "text-normal-text",
      error: "text-normal-text",
      disabled: "text-normal-text",
      warning: "text-normal-text",
      dark: "text-light",
    },
    isInline: {
      true: "mb-2 text-left sm:mb-0 sm:text-right",
      false: "mb-4 text-left",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

const selectIconStyles = cva(
  "logo absolute right-9 top-1/3 h-[3px] w-[3px] -translate-y-1/2 transform shadow-[3px_3px,6px_3px,9px_3px,12px_3px,15px_3px,18px_3px,21px_3px,3px_6px,6px_6px,9px_6px,12px_6px,15px_6px,18px_6px,21px_6px,6px_9px,9px_9px,12px_9px,15px_9px,18px_9px,6px_12px,9px_12px,12px_12px,15px_12px,18px_12px,9px_15px,12px_15px,15px_15px,12px_18px]",
  {
    variants: {
      variant: {
        normal: "text-dark",
        light: "text-light",
        success: "text-success",
        primary: "text-primary",
        error: "text-error",
        disabled: "text-disabled",
        warning: "text-warning",
        dark: "text-light",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

const selectStyles = cva(
  "w-full cursor-pointer appearance-none border-none px-5 py-3 -outline-offset-2 placeholder-shown:underline",
  {
    variants: {
      variant: {
        normal: "focus:outline-dark",
        light: "focus:outline-light",
        success: "focus:ring-blue-500",
        primary: "focus:outline-primary",
        error: "focus:outline-error",
        disabled: "focus:outline-disabled",
        warning: "focus:outline-warning",
        dark: "bg-dark focus:outline-light",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

type SelectProps = VariantProps<typeof selectStyles> &
  React.HTMLAttributes<HTMLDivElement> & {
    name?: string;
    label?: string;
    isInline?: boolean;
    required?: boolean;
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  };

export const Select = ({
  name,
  label,
  isInline,
  variant,
  required,
  children,
  placeholder,
  className,
  value,
  onChange,
  ...props
}: SelectProps) => {
  const [internalValue, setInternalValue] = useState<string>();
  const selectClasses = selectStyles({ variant });

  const isControlled = value !== undefined;
  const parsedValue = isControlled ? value : internalValue;
  const isSelected = !!parsedValue;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isControlled) {
      setInternalValue(event.target.value);
    }
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div
      {...props}
      className={
        isSelected
          ? selectLabelStyles({ variant })
          : selectContainerStyles({ variant })
      }
    >
      <label
        htmlFor={name}
        className={clsx(
          "flex-grow-1 mr-6 basis-0 text-base",
          selectLabelStyles({ variant, isInline }),
        )}
      >
        {label}
      </label>

      <div className="relative flex-grow-[5] basis-0">
        <select
          id={name}
          name={name}
          required={required}
          value={parsedValue}
          onChange={handleChange}
          className={cn(selectClasses, className)}
        >
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
          {children}
        </select>

        <div className={selectIconStyles({ variant })} />

        <Borders variant={variant === "dark" ? "light" : variant} />
      </div>
    </div>
  );
};
