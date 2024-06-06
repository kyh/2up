"use client"

import React, { useState } from "react";
import { clsx } from "clsx";

export default function NostalgicSelect({
  name,
  isinline,
  label,
  theme,
  required,
  children,
  placeholder,
  ...props
}) {
  const iconStyles = {
    normal: "text-dark",
    success: "text-success",
    primary: "text-primary",
    error: "text-error",
    disabled: "text-disabled",
    warning: "text-warning",
    dark: "text-light",
  };

  var iconClasses = iconStyles[theme] || iconStyles.normal;

  const dropdownicon = (
    <div
      className={clsx(
        iconClasses,
        `logo absolute right-9 top-1/3 h-[3px]  w-[3px] -translate-y-1/2 transform `,
      )}
      style={{
        boxShadow: `3px 3px, 6px 3px, 9px 3px, 12px 3px, 15px 3px, 18px 3px, 21px 3px, 3px 6px, 6px 6px, 9px 6px, 12px 6px, 15px 6px, 18px 6px, 21px 6px, 6px 9px, 9px 9px, 12px 9px, 15px 9px, 18px 9px, 6px 12px, 9px 12px, 12px 12px, 15px 12px, 18px 12px, 9px 15px, 12px 15px, 15px 15px, 12px 18px`,
      }}
    ></div>
  );

  const [isSelected, setIsSelected] = useState(false);

  const handleChange = (event) => {
    setIsSelected(true);
  };

  const spanStyles = {
    normal: "border-dark",
    success: "border-success",
    primary: "border-primary",
    error: "border-error",
    disabled: "border-disabled",
    warning: "border-warning",
    dark: "border-light",
  };

  var spanClasses = spanStyles[theme] || spanStyles.normal;

  const Styles = {
    normal: {
      all: "text-dark-999",
      txt: "text-normal-text",
      input: "focus:outline-dark border-normal-border",
    },

    success: {
      all: "text-dark-999",
      txt: "text-normal-text",
      input: "focus:outline-success focus:ring-blue-500 border-success-border",
    },

    dark: {
      all: "text-light",
      txt: "text-light",
      input: "focus:outline-light border-light",
    },

    error: {
      all: "text-dark-999",
      txt: "text-normal-text",
      input: "focus:outline-error border-error-border",
    },

    warning: {
      all: "text-dark-999",
      txt: "text-normal-text",
      input: "focus:outline-warning border-warning-border",
    },
  };

  var classes = Styles[theme] || Styles.normal;

  return (
    <div
      {...props}
      className={clsx(
        isSelected ? classes.txt : classes.all,
        `mb-3 flex w-full  flex-nowrap text-base`,
        isinline ? `flex-col sm:flex-row` : `flex-col`,
        theme === "dark" ? `bg-dark p-4` : ``,
      )}
    >
      <label
        htmlFor={name}
        className={clsx(
          classes.txt,
          `flex-grow-1 mr-6 basis-0 text-base`,
          isinline ? `mb-2 text-left sm:mb-0 sm:text-right` : `mb-4 text-left`,
        )}
      >
        {label}
      </label>
      <div className=" relative flex-grow-[5] basis-0">
        <select
          id={name}
          name={name}
          required={required}
          onChange={handleChange}
          className={clsx(
            classes.input,
            `w-full cursor-pointer appearance-none border-none px-5 py-3 -outline-offset-2 placeholder-shown:underline`,
            theme === "dark" ? `bg-dark` : ``,
          )}
        >
          <option value="" disabled selected hidden>
            {placeholder}
          </option>
          {children}
        </select>

        {dropdownicon}
        <span
          className={clsx(
            spanClasses,
            `pointer-events-none absolute left-[0px] top-[-4px] h-[calc(100%+8px)] w-[100%] border-y-4 px-3 py-2`,
          )}
        ></span>

        <span
          className={clsx(
            spanClasses,
            `pointer-events-none absolute left-[-4px] top-[0px] h-[100%] w-[calc(100%+8px)] border-x-4 px-3 py-2`,
          )}
        ></span>
      </div>
    </div>
  );
}
