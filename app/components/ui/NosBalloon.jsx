import React from "react";
import clsx from "clsx";

import CornerShapes from "./Corners";

export default function Balloon({ type, from, children, ...props }) {
  const typeClassMap = {
    normal: "text-dark bg-light border-dark",
    dark: "text-light bg-dark border-light",
  };

  var classes = typeClassMap[type] || typeClassMap.normal;

  return (
    <div
      className={`${classes} relative m-1 mb-5 h-fit w-fit whitespace-break-spaces px-6 py-5 text-base`}
    >
      {type === "dark" ? (
        <CornerShapes type="dark" />
      ) : (
        <CornerShapes type="light" />
      )}

      <span
        className={clsx(
          from === "left" ? `left-10` : `right-10`,
          `absolute bottom-0 h-5 w-7 translate-y-5`,
        )}
      >
        <span
          className={clsx(
            classes,
            from === "left" ? `left-0` : `right-0`,
            `absolute top-0 h-2 w-7 border-x-4`,
          )}
        ></span>
        <span
          className={clsx(
            classes,
            from === "left" ? `-left-1` : `-right-1`,
            `absolute top-2 h-1 w-7 border-x-4`,
          )}
        ></span>
        <span
          className={clsx(
            classes,
            from === "left" ? `-left-2` : `-right-2`,
            `absolute top-3 h-1  w-7 border-x-4`,
          )}
        ></span>
        <span
          className={clsx(
            classes,
            from === "left" ? `-left-2` : `-right-2`,
            `absolute top-4 h-1  w-6 border-x-4 border-b-4`,
          )}
        ></span>
      </span>

      {children}
    </div>
  );
}
