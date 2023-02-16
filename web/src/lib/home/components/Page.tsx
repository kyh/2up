import { classed } from "@tw-classed/react";

export const PageContainer = classed.section(
  "flex flex-col items-center p-4 mx-auto h-[calc(100vh-50px)]",
  {
    variants: {
      size: {
        large: "max-w-[900px]",
        full: "max-w-full",
        default: "max-w-[600px]"
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        stretch: "[justify-content:stretch]",
      }
    },
    defaultVariants: {
      size: "default",
      justify: "center"
    }
  }
);
