"use client"

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Radio({ name, type, yes, no, ...props }) {
  const [checked, setChecked] = useState("yes");
  const typeClassMap = {
    normal: "text-dark",
    dark: "text-light",
  };

  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    if (isBlinking) {
      const blinkIntervalout = setInterval(() => {
        specificDivRef.current.querySelectorAll(
          ".animate-custom",
        )[0].style.opacity = 0;
      }, 1000);
      const blinkIntervalin = setInterval(() => {
        specificDivRef.current.querySelectorAll(
          ".animate-custom",
        )[0].style.opacity = 1;
      }, 2000);

      return () => {
        clearInterval(blinkIntervalin);
        clearInterval(blinkIntervalout);
      };
    }
  }, [isBlinking]);

  const handleClickOutside = (event) => {
    if (
      specificDivRef.current &&
      !specificDivRef.current.contains(event.target)
    ) {
      // The click is outside the specific div
      if (specificDivRef.current.querySelectorAll(".animate-custom")[0]) {
        specificDivRef.current.querySelectorAll(
          ".animate-custom",
        )[0].style.opacity = 1;
      }
      setIsBlinking(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const logo = (
    <div
      className={clsx(
        `logo absolute -left-6 top-0 h-[2px] w-[2px] -translate-y-1/2 transform group-active:text-dark-888`,
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
    ></div>
  );

  const specificDivRef = useRef();

  var classes = typeClassMap[type] || typeClassMap.normal;

  return (
    <div ref={specificDivRef}>
      <label
        {...props}
        htmlFor={name + "yes"}
        onClick={() => {
          setChecked("yes");
          setIsBlinking(true);
        }}
        className={clsx(
          classes,
          `m-5 cursor-pointer text-base `,
          type === "dark" ? `` : `group`,
        )}
      >
        <input
          type="radio"
          id={name + "yes"}
          name={name}
          value={yes}
          checked={checked === "yes"}
          className={clsx(
            `mr-4 h-0 w-0 outline-0`,
            isBlinking && `animate-blink`,
          )}
        />
        <span className={clsx(`relative`)}>
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
        className={clsx(
          classes,
          `m-5 cursor-pointer text-base `,
          type === "dark" ? `` : `group`,
        )}
      >
        <input
          type="radio"
          id={name + "no"}
          name={name}
          value={no}
          checked={checked === "no"}
          className={clsx(
            `mr-4 h-0 w-0 outline-0`,
            isBlinking && `animate-blink`,
          )}
        />
        <span className="relative ">
          {checked === "no" && logo}
          {no}
        </span>
      </label>
    </div>
  );
}

Radio.defaultProps = {
  yes: "Yes",
  no: "No",
};
