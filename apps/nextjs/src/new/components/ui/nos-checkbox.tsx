"use client";

import React, { useState } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

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
    isChecked?: boolean;
    onChange?: (isChecked: boolean) => void;
  };

export const Checkbox = ({
  variant,
  label,
  name,
  isChecked,
  onChange,
  className,
  ...props
}: CheckboxProps) => {
  const [internalIsChecked, setInternalIsChecked] = useState(false);
  const isControlled = isChecked !== undefined;
  const classes = checkboxStyles({ variant });

  const parsedIsChecked = isControlled ? isChecked : internalIsChecked;
  const iconBoxClasses = iconBoxShadowStyles({ isChecked: parsedIsChecked });

  const handleCheckboxChange = () => {
    if (!isControlled) {
      setInternalIsChecked(!parsedIsChecked);
    }
    if (onChange) {
      onChange(!parsedIsChecked);
    }
  };

  return (
    <div>
      <label {...props} htmlFor={name} className={cn(classes, className)}>
        <input
          type="checkbox"
          id={name}
          name={name}
          value={label}
          checked={parsedIsChecked}
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
