import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const listStyles = cva("text-dark` list-none text-base", {
  variants: {
    variant: {
      normal: "text-dark",
      dark: "text-dark",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

type ListProps = VariantProps<typeof listStyles> &
  React.HTMLAttributes<HTMLUListElement> & {
    data: string[];
  };

export const List = ({ data, variant, ...props }: ListProps) => {
  const blackIcon = (
    <div
      className={clsx(
        `logo absolute -left-6 top-1 h-[2px] w-[2px] -translate-y-1/2 transform text-dark`,
      )}
      style={{
        boxShadow: `8px 2px, 10px 2px, 6px 4px, 8px 4px, 10px 4px, 12px 4px, 4px 6px, 6px 6px, 8px 6px, 10px 6px, 12px 6px, 14px 6px, 4px 8px, 6px 8px, 8px 8px, 10px 8px, 12px 8px, 14px 8px, 6px 10px, 8px 10px, 10px 10px, 12px 10px, 8px 12px, 10px 12px`,
      }}
    />
  );

  const whiteIcon = (
    <div
      className={clsx(
        `logo absolute -left-6 top-1 h-[2px] w-[2px] -translate-y-1/2 transform text-dark`,
      )}
      style={{
        boxShadow: `8px 2px, 10px 2px, 6px 4px, 8px 4px, 10px 4px, 12px 4px, 4px 6px, 6px 6px, 12px 6px, 14px 6px, 4px 8px, 6px 8px, 12px 8px, 14px 8px, 6px 10px, 8px 10px, 10px 10px, 12px 10px, 8px 12px, 10px 12px`,
      }}
    />
  );

  return (
    <ul {...props} className={`list-none text-base text-dark`}>
      {data.map((item, index) => {
        return (
          <li className="relative ml-4" key={index}>
            {variant === "dark" ? blackIcon : whiteIcon}
            {item}
          </li>
        );
      })}
    </ul>
  );
};
