"use client";

import React, { useEffect, useRef, useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

const radioStyles = cva("m-5 cursor-pointer text-base", {
  variants: {
    variant: {
      normal: "group text-dark",
      dark: "text-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

type RadioProps = VariantProps<typeof radioStyles> &
  React.HTMLAttributes<HTMLLabelElement> & {
    name?: string;
    yes: React.InputHTMLAttributes<HTMLInputElement>["value"];
    no: React.InputHTMLAttributes<HTMLInputElement>["value"];
  };

export const Radio = ({
  name,
  variant,
  yes = "Yes",
  no = "No",
  ...props
}: RadioProps) => {
  const [checked, setChecked] = useState("yes");
  const [isBlinking, setIsBlinking] = useState(false);
  const specificDivRef = useRef<HTMLDivElement>(null);
  const classes = radioStyles({ variant });

  const handleClickOutside = (event: MouseEvent) => {
    if (!event) return;

    if (
      specificDivRef.current &&
      !specificDivRef.current.contains(event.target as HTMLElement)
    ) {
      const logoDiv = specificDivRef.current?.querySelector(
        ".animate-custom",
      ) as HTMLDivElement;

      if (!logoDiv) return;

      logoDiv.style.opacity = "1";
      setIsBlinking(false);
    }
  };

  useEffect(() => {
    if (isBlinking) {
      const blinkIntervalOut = setInterval(() => {
        const logoDiv = specificDivRef.current?.querySelector(
          ".animate-custom",
        ) as HTMLDivElement;
        if (!logoDiv) return;

        logoDiv.style.opacity = "0";
      }, 1000);

      const blinkIntervalIn = setInterval(() => {
        const logoDiv = specificDivRef.current?.querySelector(
          ".animate-custom",
        ) as HTMLDivElement;
        if (!logoDiv) return;

        logoDiv.style.opacity = "1";
      }, 2000);

      return () => {
        clearInterval(blinkIntervalOut);
        clearInterval(blinkIntervalIn);
      };
    }
  }, [isBlinking, specificDivRef]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const logo = (
    <div
      className={clsx(
        "logo absolute -left-6 top-0 h-[2px] w-[2px] -translate-y-1/2 transform group-active:text-dark-888",
        isBlinking && `animate-custom`,
      )}
      style={{
        boxShadow: `
      2px 2px, 4px 2px, 2px 4px, 4px 4px, 6px 4px, 8px 4px,
      2px 6px, 4px 6px, 6px 6px, 8px 6px, 10px 6px, 2px 8px,
      4px 8px, 6px 8px, 8px 8px, 10px 8px, 12px 8px, 2px 10px,
      4px 10px, 6px 10px, 8px 10px, 10px 10px, 2px 12px, 4px 12px,
      6px 12px, 8px 12px, 2px 14px, 4px 14px
    `,
      }}
    />
  );

  return (
    <div ref={specificDivRef}>
      <label
        {...props}
        htmlFor={name + "yes"}
        onClick={() => {
          setChecked("yes");
          setIsBlinking(true);
        }}
        className={classes}
      >
        <input
          type="radio"
          id={name + "yes"}
          name={name}
          value={yes}
          checked={checked === "yes"}
          className={clsx(
            "mr-4 h-0 w-0 outline-0",
            isBlinking && "animate-blink",
          )}
        />
        <span className="relative">
          {checked === "yes" && logo}
          {yes}
        </span>
      </label>

      <label
        {...props}
        htmlFor={name + "no"}
        onClick={() => {
          setChecked("no");
          setIsBlinking(true);
        }}
        className={classes}
      >
        <input
          type="radio"
          id={name + "no"}
          name={name}
          value={no}
          checked={checked === "no"}
          className={clsx(
            "mr-4 h-0 w-0 outline-0",
            isBlinking && "animate-blink",
          )}
        />
        <span className="relative">
          {checked === "no" && logo}
          {no}
        </span>
      </label>
    </div>
  );
};
