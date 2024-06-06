import React from "react";
import { clsx } from "clsx";

export default function NostalgicBtn({
  block,
  type,
  className,
  children,
  ...props
}) {
  const buttonStyles = {
    normal:
      "text-normal-text bg-normal shadow-normal-shadow hover:shadow-normal-shadow  active:shadow-normal-shadow hover:bg-normal-hover focus:outline-normal-outline border-normal-border",

    success:
      "text-success-text bg-success shadow-success-shadow hover:shadow-success-shadow active:shadow-success-shadow hover:bg-success-hover focus:outline-success-outline border-success-border",

    primary:
      "text-primary-text bg-primary shadow-primary-shadow hover:shadow-primary-shadow active:shadow-primary-shadow hover:bg-primary-hover focus:outline-primary-outline border-primary-border",

    error:
      "text-error-text bg-error shadow-error-shadow hover:shadow-error-shadow  active:shadow-error-shadow hover:bg-error-hover focus:outline-error-outline border-error-border",

    disabled:
      "cursor-not-allowed text-disabled-text bg-disabled shadow-disabled-shadow border-disabled-border",

    warning:
      "text-warning-text bg-warning shadow-warning-shadow hover:shadow-warning-shadow  active:shadow-warning-shadow hover:bg-warning-hover focus:outline-warning-outline border-warning-border",
  };

  var btnClasses = buttonStyles[type] || buttonStyles.normal;

  const spanStyles = {
    normal: "border-normal-border",
    success: "border-success-border",
    primary: "border-primary-border",
    error: "border-error-border",
    disabled: "border-disabled-border",
    warning: "border-warning-border",
  };

  var spanClasses = spanStyles[type] || spanStyles.normal;

  return type === "file" ? (
    <label
      {...props}
      className={clsx(
        className,
        btnClasses,
        block ? `mb-6 block whitespace-break-spaces break-words` : ``,
        `relative m-2 px-3 py-3 text-base capitalize shadow-[inset_-4px_-4px] hover:shadow-[inset_-6px_-6px] focus:outline focus:outline-[6px] active:shadow-[inset_6px_6px]`,
      )}
    >
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

      {type === "file" ? (
        <input type="file" className="pointer-events-none absolute opacity-0" />
      ) : (
        <></>
      )}
      {children}
    </label>
  ) : (
    <button
      {...props}
      type="button"
      className={clsx(
        className,
        btnClasses,
        block ? `mb-6 block whitespace-break-spaces break-words` : ``,
        `relative m-2 px-3 py-3 text-base capitalize shadow-[inset_-4px_-4px]`,
        type !== "disabled" &&
          `hover:shadow-[inset_-6px_-6px] focus:outline focus:outline-[6px] active:shadow-[inset_6px_6px]`,
      )}
    >
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
      {children}
    </button>
  );
}
