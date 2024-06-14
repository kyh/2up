import React from "react";
import { cva, VariantProps } from "class-variance-authority";

const avatarStyles = cva("aspect-square overflow-hidden bg-gray-500", {
  variants: {
    size: {
      normal: "h-8 w-8",
      small: "h-4 w-4",
      medium: "h-12 w-12",
      large: "h-16 w-16",
    },
    rounded: {
      true: "rounded-full",
      false: "",
    },
  },
  defaultVariants: {
    size: "normal",
    rounded: false,
  },
});

type AvatarProps = VariantProps<typeof avatarStyles> &
  React.ImgHTMLAttributes<HTMLImageElement>;

export const Avatar = ({
  alt,
  size = "normal",
  src,
  rounded = false,
  ...props
}: AvatarProps) => {
  const classes = avatarStyles({ size, rounded });

  return (
    <img
      style={{ imageRendering: "pixelated" }}
      src={src}
      alt={alt}
      className={classes}
      {...props}
    />
  );
};
