import { classed } from "@tw-classed/react";
import { size } from "lodash";
import React from "react";

type Props = {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  variant?: "red" | "green" | "gray" | "dark"; // Represents the color of the tile
  size?: "small" | "medium" | "large" | "full" | "xsmall";
};

const backgroundClasses = {
  red: "bg-accent-red-regular",
  green: "bg-accent-green-light",
  gray: "bg-accent-gray-regular",
  dark: "bg-accent-gray-dark",
};

const sizeClasses = {
  small: "w-64 h-64",
  medium: "w-[535px] h-auto",
  large: "w-auto h-64",
  full: "w-full h-full",
  xsmall: "w-[203px] h-[212px]",
};

export const Tile = ({
  children,
  className = "",
  id = "",
  variant = "gray",
  size = "medium",
}: Props) => {
  const backgroundColor = backgroundClasses[variant];
  const area = sizeClasses[size];
  return (
    <div className={`${className} ${backgroundColor}  `} id={id}>
      {children}
    </div>
  );
};
