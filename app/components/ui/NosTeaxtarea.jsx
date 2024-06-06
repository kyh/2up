import React from "react";
import { clsx } from "clsx";

export default function NostalgicTextarea({
  name,
  label,
  theme,
  id,
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
    dark: {
      all: "text-light",
      input: "focus:outline-light border-light",
    },
  };

  var classes = Styles[theme] || Styles["normal"];

  return (
    <div
      {...props}
      className={clsx(
        classes.all,
        `mb-3 flex w-full  flex-col flex-nowrap text-base`,
        theme === "dark" ? `bg-dark p-4` : ``,
      )}
    >
      <label
        htmlFor={name}
        className={clsx(`flex-grow-1 mb-4 mr-6 basis-0 text-left text-base`)}
      >
        {label}
      </label>
      <div className=" relative flex-grow-[5] basis-0">
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          className={clsx(
            classes.input,
            `min-h-full w-full border-none px-5 py-3 -outline-offset-2 placeholder:text-dark-555`,
            theme === "dark" ? `bg-dark` : ``,
          )}
        />

        <span
          className={clsx(
            spanClasses,
            `pointer-events-none absolute left-[0px] top-[-4px] h-[calc(100%+8px)] w-[100%] border-y-4 px-5 py-3`,
          )}
        ></span>

        <span
          className={clsx(
            spanClasses,
            `pointer-events-none absolute left-[-4px] top-[0px] h-[100%] w-[calc(100%+8px)] border-x-4 px-5 py-3`,
          )}
        ></span>
      </div>
    </div>
  );
}
