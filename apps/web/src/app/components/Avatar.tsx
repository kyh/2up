import { classed, deriveClassed } from "~/utils/classed";

export const Avatar = classed.div(
  "text-white p-2 flex flex-between rounded-[50%] items-center justify-center z-50",
  {
    variants: {
      size: {
        small: "w-10 h-10",
        large: "w-14 h-14",
      },
      variant: {
        error: "bg-accent-red-regular",
        warning: "bg-accent-yellow-regular",
        information: "bg-accent-gray-regular",
        success: "bg-accent-green-light",
        info: "bg-accent-blue-regular",
      },
    },
    defaultVariants: {
      size: "large",
      variant: "info",
    },
  },
);
