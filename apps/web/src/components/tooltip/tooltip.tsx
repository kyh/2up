import type { FloatProps } from "@headlessui-float/react";
import { Float } from "@headlessui-float/react";
import { useState } from "react";
import { classed } from "@/lib/utils/classed";

export const Tooltip = classed.div(
  "flex items-start rounded-wavy p-3",
  "text-white dark:text-black bg-black dark:bg-white",
);

type Props = {
  children: React.ReactNode;
  tipContent: React.ReactNode;
} & Omit<FloatProps, "children">;

export const WithTip = ({ children, tipContent, ...props }: Props) => {
  const [show, setShow] = useState(false);

  return (
    <Float
      enter="ease-out duration-100"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      flip
      leave="ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      offset={8}
      portal
      shift={6}
      show={show}
      {...props}
    >
      <div
        onMouseEnter={() => {
          setShow(true);
        }}
        onMouseLeave={() => {
          setShow(false);
        }}
      >
        {children}
      </div>
      <Tooltip>{tipContent}</Tooltip>
    </Float>
  );
};
