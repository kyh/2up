import React from "react";
import clsx from "clsx";

interface BordersProps {
  theme: "normal" | "success" | "primary" | "error" | "disabled" | "warning";
  classes?: string;
}

const Borders: React.FC<BordersProps> = ({ theme, classes }) => {
  const spanStyles: { [key: string]: string } = {
    normal: "border-normal",
    success: "border-success",
    primary: "border-primary",
    error: "border-error",
    disabled: "border-disabled",
    warning: "border-warning",
  };

  const spanClasses = spanStyles[theme] || spanStyles.normal;

  return (
    <>
      <span
        className={clsx(
          spanClasses,
          "pointer-events-none absolute left-0 top-[-4px] h-[calc(100%+8px)] w-full border-y-4 px-3 py-2",
          classes,
        )}
      ></span>

      <span
        className={clsx(
          spanClasses,
          "pointer-events-none absolute left-[-4px] top-0 h-full w-[calc(100%+8px)] border-x-4 px-3 py-2",
          classes,
        )}
      ></span>
    </>
  );
};

export default Borders;
