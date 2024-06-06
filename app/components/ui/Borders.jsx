import React from "react";
import clsx from "clsx";

export default function Borders({ theme, classes }) {
  const spanStyles = {
    normal: "border-normal-border",
    success: "border-success-border",
    primary: "border-primary-border",
    error: "border-error-border",
    disabled: "border-disabled-border",
    warning: "border-warning-border",
  };

  var spanClasses = spanStyles[theme] || spanStyles.normal;

  return (
    <>
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
    </>
  );
}
