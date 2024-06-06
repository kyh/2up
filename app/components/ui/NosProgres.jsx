import React from "react";
import clsx from "clsx";

export const Edges = ({ type }) => {
  const spanStyles = {
    normal: "border-dark",
    dark: "border-light",
  };

  var spanClasses = spanStyles[type] || spanStyles.normal;

  return (
    <span span>
      <span
        className={clsx(
          spanClasses,
          `pointer-events-none absolute left-[0px] top-[-4px] h-[calc(100%+8px)] w-[calc(100%-0px)] border-y-4 px-3 py-2`,
        )}
      ></span>

      <span
        className={clsx(
          spanClasses,
          `pointer-events-none absolute left-[-4px] top-[0px] h-[calc(100%-0px)] w-[calc(100%+8px)] border-x-4 px-3 py-2`,
        )}
      ></span>
    </span>
  );
};

export default function Progres({ type, percent, ...props }) {
  const pattern = {
    backgroundImage:
      "linear-gradient(90deg, rgb(51, 51, 51) 10px, white 10px), linear-gradient(90deg, white 10px, rgb(51, 51, 51) 10px), linear-gradient(90deg, rgb(51, 51, 51) 10px, white 10px),linear-gradient(90deg, white 10px, rgb(51, 51, 51) 10px)",
    backgroundPosition: "0 0, 0 10px, 0 20px, 0 30px",
    backgroundRepeat: "repeat-x",
    backgroundSize: "20px 10px, 20px 10px,20px 10px,20px 10px",
    width: percent + "%",
  };

  const typeClassMap = {
    normal: "bg-dark",
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
    pattern: "bg-light",
  };

  var classes = typeClassMap[type] || typeClassMap.normal;

  return (
    <div {...props} className="relative h-12 w-full bg-light p-1">
      <Edges />
      <div
        style={type === "pattern" ? pattern : { width: percent + "%" }}
        className={clsx(classes, `h-full`)}
      ></div>
    </div>
  );
}
