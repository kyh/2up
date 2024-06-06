import React from "react";
import clsx from "clsx";

import CornerShapes from "./Corners";

export default function Container({
  type,
  heading,
  children,
  centered,
  rounded,
  ...props
}) {
  const typeClassMap = {
    normal: "text-dark bg-light border-dark",
    dark: "text-light bg-dark border-light",
  };

  var classes = typeClassMap[type] || typeClassMap.normal;

  return (
    <div className={clsx(classes, rounded && `p-1`)}>
      <div
        {...props}
        className={clsx(
          classes,
          rounded ? `` : `border-4`,
          heading ? `pt-10` : `py-5`,
          centered ? `text-center` : `text-left`,
          `relative m-1 box-border flex  flex-wrap gap-5 p-6`,
        )}
      >
        {rounded &&
          (type === "dark" ? (
            <CornerShapes type="dark" />
          ) : (
            <CornerShapes type="light" />
          ))}

        {heading && (
          <span
            className={clsx(
              centered ? `left-1/2 -translate-x-1/2` : `left-1 sm:left-10`,
              type === "dark" ? `bg-dark text-light` : `bg-light text-dark`,
              `absolute top-[-6px] px-2`,
            )}
          >
            {heading}
          </span>
        )}
        {children}
      </div>
    </div>
  );
}
