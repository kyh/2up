import React from "react";
import { clsx } from "clsx";

export default function NostalgicInput({
  name,
  isinline,
  label,
  theme,
  type,
  placeholder,
  ...props
}) {
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
      all: "text-normal-text",
      input: "focus:outline-dark border-normal-border",
    },

    success: {
      all: "text-normal-text",
      input: "focus:outline-success border-success-border",
    },

    dark: {
      all: "text-light",
      input: "focus:outline-light border-light",
    },

    error: {
      all: "text-normal-text",
      input: "focus:outline-error border-error-border",
    },

    warning: {
      all: "text-normal-text",
      input: "focus:outline-warning border-warning-border",
    },
  };

  var classes = Styles[theme] || Styles.normal;

  return (
    <div
      {...props}
      className={clsx(
        classes.all,
        `mb-3 flex w-full  flex-nowrap text-base`,
        isinline ? `flex-col sm:flex-row` : `flex-col`,
        theme === "dark" ? `bg-dark p-4` : ``,
      )}
    >
      <label
        htmlFor={name}
        className={clsx(
          `flex-grow-1 mr-6 basis-0 text-base`,
          isinline ? `mb-4 text-left sm:mb-0 sm:text-right` : `mb-4 text-left`,
        )}
      >
        {label}
      </label>
      <div className=" relative flex-grow-[5] basis-0">
        <input
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          className={clsx(
            classes.input,
            `w-full border-none px-5 py-3 -outline-offset-2 placeholder:text-dark-555`,
            theme === "dark" ? `bg-dark` : ``,
          )}
        />

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
