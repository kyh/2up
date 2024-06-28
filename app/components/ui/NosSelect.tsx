"use client";

import React, { useState } from "react";
import { cva, VariantProps } from "class-variance-authority";

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

const selectLabelStyles = cva("flex-grow-1 mr-6 basis-0 text-base", {
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
  "logo absolute right-9 top-1/3 h-[3px] w-[3px] -translate-y-1/2 transform",
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
  };

export const Select = ({
  name,
  label,
  isInline,
  variant,
  required,
  children,
  placeholder,
  ...props
}: SelectProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const selectClasses = selectStyles({ variant });

  const dropdownIcon = (
    <div
      className={selectIconStyles({ variant })}
      style={{
        boxShadow:
          "3px 3px, 6px 3px, 9px 3px, 12px 3px, 15px 3px, 18px 3px, 21px 3px, 3px 6px, 6px 6px, 9px 6px, 12px 6px, 15px 6px, 18px 6px, 21px 6px, 6px 9px, 9px 9px, 12px 9px, 15px 9px, 18px 9px, 6px 12px, 9px 12px, 12px 12px, 15px 12px, 18px 12px, 9px 15px, 12px 15px, 15px 15px, 12px 18px",
      }}
    />
  );

  const handleChange = () => setIsSelected(true);

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
        className={selectLabelStyles({ variant, isInline })}
      >
        {label}
      </label>

      <div className="relative flex-grow-[5] basis-0">
        <select
          id={name}
          name={name}
          required={required}
          onChange={handleChange}
          className={selectClasses}
        >
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
          {children}
        </select>

        {dropdownIcon}

        <Borders variant={variant === "dark" ? "light" : variant} />
      </div>
    </div>
  );
};
