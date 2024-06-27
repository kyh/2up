"use client";

import React, { useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const checkboxStyles = cva("m-5 cursor-pointer text-base", {
  variants: {
    variant: {
      normal: "text-dark",
      dark: "text-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

type CheckboxProps = VariantProps<typeof checkboxStyles> &
  React.HTMLAttributes<HTMLLabelElement> & {
    label: string;
    name: string;
  };

export const Checkbox = ({ variant, label, name, ...props }: CheckboxProps) => {
  const [checked, setChecked] = useState(false);
  const classes = checkboxStyles({ variant });

  const checkLogo = (
    <div
      className="logo absolute -left-8 -top-[3px] h-[2px] w-[2px] -translate-y-1/2 transform group-active:text-dark-888"
      style={{
        boxShadow:
          "2px 2px, 4px 2px, 6px 2px, 8px 2px, 10px 2px, 12px 2px, 14px 2px, 18px 2px, 20px 2px, 2px 4px, 16px 4px, 18px 4px, 20px 4px, 2px 6px, 14px 6px, 16px 6px, 2px 8px, 4px 8px, 12px 8px, 14px 8px, 2px 10px, 4px 10px, 6px 10px, 10px 10px, 12px 10px, 16px 10px, 2px 12px, 6px 12px, 8px 12px, 10px 12px, 16px 12px, 2px 14px, 8px 14px, 16px 14px, 2px 16px, 4px 16px, 6px 16px, 8px 16px, 10px 16px, 12px 16px, 14px 16px, 16px 16px",
      }}
    />
  );
  const boxLogo = (
    <div
      className="logo absolute -left-8 -top-[3px] h-[2px] w-[2px] -translate-y-1/2 transform group-active:text-dark-888"
      style={{
        boxShadow:
          "2px 2px, 4px 2px, 6px 2px, 8px 2px, 10px 2px, 12px 2px, 14px 2px, 16px 2px, 2px 4px, 16px 4px, 2px 6px, 16px 6px, 2px 8px, 16px 8px, 2px 10px, 16px 10px, 2px 12px, 16px 12px, 2px 14px, 16px 14px, 2px 16px, 4px 16px, 6px 16px, 8px 16px, 10px 16px, 12px 16px, 14px 16px, 16px 16px",
      }}
    />
  );

  const handleCheckboxChange = () => setChecked(!checked);

  return (
    <div>
      <label
        {...props}
        htmlFor={name}
        className={clsx(classes, variant === "dark" ? "" : "group")}
      >
        <input
          type="checkbox"
          id={name}
          name={name}
          value={label}
          checked={checked}
          onChange={handleCheckboxChange}
          className="mr-4 h-0 w-0 outline-0"
        />
        <span className="relative ml-4 select-none">
          {checked ? checkLogo : boxLogo}
          {label}
        </span>
      </label>
    </div>
  );
};
