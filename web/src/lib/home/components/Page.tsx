import { classed } from "@tw-classed/react";

export const PageContainer = classed.section(
  "flex flex-col items-center justify-center p-4 mx-auto h-[calc(100vh-50px)]",
  {
    variants: {
      size: {
        large: "max-w-[900px]",
        full: "max-w-full",
        default: "max-w-[600px]"
      },
    },
    defaultVariants: {
      size: "default",
    }
  }
);
