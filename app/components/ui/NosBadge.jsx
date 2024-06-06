import React from "react";
import clsx from "clsx";

export default function Badge({ size, type, type2, label, label2, ...props }) {
  const typeClassMap = {
    dark: "text-light bg-dark",
    primary: "text-primary-text bg-primary",
    success: "text-success-text bg-success",
    warning: "text-warning-text bg-warning",
    error: "text-error-text bg-error",
  };

  var classes = typeClassMap[type] || typeClassMap.primary;
  var classes2 = typeClassMap[type2] || typeClassMap.primary;

  const borderClassMap = {
    dark: "border-dark",
    primary: "border-primary",
    success: "border-success",
    warning: "border-warning",
    error: "border-error",
  };

  var borderclass = borderClassMap[type] || borderClassMap.primary;
  var borderclass2 = borderClassMap[type2] || borderClassMap.primary;

  const textClassMap = {
    small: "text-[9px]",
    medium: "text-sm",
    normal: "text-base",
  };

  var textclass = textClassMap[size] || textClassMap.normal;

  return (
    <div className={clsx(textclass)}>
      {!label2 ? (
        <div
          className={clsx(
            classes,
            size === "normal" || !size
              ? `mx-2 min-w-[10em]`
              : ` mx-1 min-h-[20px] w-fit min-w-[20px]`,
            `relative cursor-pointer p-1 text-center`,
          )}
        >
          <span
            className={clsx(
              borderclass,
              size === "normal" || !size
                ? `-left-2 border-x-8`
                : `-left-1 border-x-4`,
              `absolute top-1/2 box-content h-1/2 w-full -translate-y-1/2 border-dark`,
            )}
          ></span>
          {label}
        </div>
      ) : (
        <div
          className={clsx(
            size === "normal" || !size ? `mx-2 min-w-[5em] ` : ` mx-1 w-fit `,
            `flex cursor-pointer text-center`,
          )}
        >
          <div className={clsx(classes, `relative flex-1 p-1`)}>
            <span
              className={clsx(
                borderclass,
                size === "normal" || !size
                  ? `-left-2 border-l-8`
                  : `-left-1 border-l-4`,
                `absolute top-1/2 box-content h-1/2 w-full -translate-y-1/2 border-dark`,
              )}
            ></span>
            {label}
          </div>
          <div className={clsx(classes2, `relative flex-1 p-1`)}>
            <span
              className={clsx(
                borderclass2,
                size === "normal" || !size
                  ? `-right-2 border-r-8`
                  : `-right-1 border-r-4`,
                `absolute top-1/2 box-content h-1/2 w-full -translate-y-1/2  border-dark`,
              )}
            ></span>
            {label2}
          </div>
        </div>
      )}
    </div>
  );
}
