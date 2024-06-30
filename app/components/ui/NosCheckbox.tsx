"use client";

import React, { useState } from "react";
import { cva, VariantProps } from "class-variance-authority";

const checkboxStyles = cva("m-5 cursor-pointer text-base", {
  variants: {
    variant: {
      normal: "group text-dark",
      dark: "text-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

const iconBoxShadowStyles = cva(
  "logo absolute -left-8 -top-[3px] h-[2px] w-[2px] -translate-y-1/2 transform group-active:text-dark-888",
  {
    variants: {
      isChecked: {
        true: "shadow-[2px_2px,_4px_2px,_6px_2px,_8px_2px,_10px_2px,_12px_2px,_14px_2px,_18px_2px,_20px_2px,_2px_4px,_16px_4px,_18px_4px,_20px_4px,_2px_6px,_14px_6px,_16px_6px,_2px_8px,_4px_8px,_12px_8px,_14px_8px,_2px_10px,_4px_10px,_6px_10px,_10px_10px,_12px_10px,_16px_10px,_2px_12px,_6px_12px,_8px_12px,_10px_12px,_16px_12px,_2px_14px,_8px_14px,_16px_14px,_2px_16px,_4px_16px,_6px_16px,_8px_16px,_10px_16px,_12px_16px,_14px_16px,_16px_16px]",
        false:
          "shadow-[2px_2px,_4px_2px,_6px_2px,_8px_2px,_10px_2px,_12px_2px,_14px_2px,_16px_2px,_2px_4px,_16px_4px,_2px_6px,_16px_6px,_2px_8px,_16px_8px,_2px_10px,_16px_10px,_2px_12px,_16px_12px,_2px_14px,_16px_14px,_2px_16px,_4px_16px,_6px_16px,_8px_16px,_10px_16px,_12px_16px,_14px_16px,_16px_16px]",
      },
    },
    defaultVariants: {
      isChecked: false,
    },
  },
);

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
      <label {...props} htmlFor={name} className={classes}>
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
          <div className={iconBoxClasses} />
          {label}
        </span>
      </label>
    </div>
  );
};
