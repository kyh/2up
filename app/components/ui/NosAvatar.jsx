import React from "react";
import clsx from "clsx";

export default function Avatar({ alt, size, source, rounded, ...props }) {
  const typeClassMap = {
    normal: "w-8 h-8",
    small: "w-4 h-4",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  };

  var classes = typeClassMap[size] || typeClassMap.normal;

  return (
    <img
      style={{ imageRendering: "pixelated" }}
      src={source}
      alt={alt}
      className={clsx(
        classes,
        rounded && `rounded-full`,
        `aspect-square overflow-hidden bg-gray-500`,
      )}
    />
  );
}
