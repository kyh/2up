import React from "react";
import clsx from "clsx";

export default function List({ data, type, ...props }) {
  const typeClassMap = {
    normal: "text-dark",
    dark: "text-dark",
  };

  var logoclasses = typeClassMap[type] || typeClassMap.normal;

  const blackicon = (
    <div
      className={clsx(
        `logo absolute -left-6 top-1 h-[2px] w-[2px] -translate-y-1/2 transform text-dark`,
      )}
      style={{
        boxShadow: `8px 2px, 10px 2px, 6px 4px, 8px 4px, 10px 4px, 12px 4px, 4px 6px, 6px 6px, 8px 6px, 10px 6px, 12px 6px, 14px 6px, 4px 8px, 6px 8px, 8px 8px, 10px 8px, 12px 8px, 14px 8px, 6px 10px, 8px 10px, 10px 10px, 12px 10px, 8px 12px, 10px 12px`,
      }}
    ></div>
  );

  const whiteicon = (
    <div
      className={clsx(
        `logo absolute -left-6 top-1 h-[2px] w-[2px] -translate-y-1/2 transform text-dark`,
      )}
      style={{
        boxShadow: `8px 2px, 10px 2px, 6px 4px, 8px 4px, 10px 4px, 12px 4px, 4px 6px, 6px 6px, 12px 6px, 14px 6px, 4px 8px, 6px 8px, 12px 8px, 14px 8px, 6px 10px, 8px 10px, 10px 10px, 12px 10px, 8px 12px, 10px 12px`,
      }}
    ></div>
  );

  return (
    <ul {...props} className={`list-none text-base text-dark`}>
      {data.map((item, index) => {
        return (
          <li className="relative ml-4" key={index}>
            {type === "dark" ? blackicon : whiteicon}
            {item}
          </li>
        );
      })}
    </ul>
  );
}
