import { classed } from "@tw-classed/react";

export const Page = classed.section(
  "min-h-screen bg-grey-background dark:bg-grey-dark",
  "desktop:overflow-x-hidden desktop:overflow-y-hidden desktop:[perspective:5px] desktop:h-screen", {
    variants: {
      bgImage: { 
        true: "before:content-[''] before:absolute before:inset-x-0 before:top-0 before:h-[120vh] before:bg-[var(--pageBgImage)] before:[transform:translateZ(-1px)] before:translate-y-[var(--pageBgTop)] before:scale-[1.2] before:bg-no-repeat bg-auto bg-[center_top] pointer-events-none",
        false: ""
      }
    },
    defaultVariants:{
      bgImage: "false"
    }
  }
);

export const Content = classed.main(
  "max-w-[900px] w-full mx-auto py-5 px-3 desktop:py-10 desktop:px-5",
  "[&_.back-link]:inline-block [&_.back-link]:mb-1 [&_.back-link]:hover:underline"
);

export const Footer = classed.footer(
  "flex justify-center items-center pt-5 pb-20 bg-no-repeat [background-size:300px] bg-[center_-30px]",
  "bg-[url('/illustrations/rainbow.svg')] [&_a]:underline"
);
