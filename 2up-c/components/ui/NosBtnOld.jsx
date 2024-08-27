import React from "react";

export default function NostalgicBtn(props) {
  const content = props.children;

  const typeStyles = {
    normal: {
      color: "text-[#000]",
      bgColor: "bg-[#fff]",
      hoverBg: "hover:bg-[#e7e7e7]",
      focusOutline: "focus:outline-[#adafbc]",
      shadow: "shadow-[inset_-4px_-4px_#b3b3b9]",
      hoverShadow: "hover:shadow-[inset_-6px_-6px_#b3b3b9]",
      activeShadow: "active:shadow-[inset_6px_6px_#b3b3b9]",
      border: "border-[#000]",
    },
    primary: {
      color: "text-[#fff]",
      bgColor: "bg-[#209cee]",
      hoverBg: "hover:bg-[#108de0]",
      focusOutline: "focus:outline-[#108de060]",
      shadow: "shadow-[inset_-4px_-4px_#006bb3]",
      hoverShadow: "hover:shadow-[inset_-6px_-6px_#006bb3]",
      activeShadow: "active:shadow-[inset_6px_6px_#006bb3]",
      border: "border-[#000]",
    },
    success: {
      color: "text-[#fff]",
      bgColor: "bg-[#92cc41]",
      hoverBg: "hover:bg-[#76c442]",
      focusOutline: "focus:outline-[#76c44260]",
      shadow: "shadow-[inset_-4px_-4px_#4aa52e]",
      hoverShadow: "hover:shadow-[inset_-6px_-6px_#4aa52e]",
      activeShadow: "active:shadow-[inset_6px_6px_#4aa52e]",
      border: "border-[#000]",
    },
    warning: {
      color: "text-[#000]",
      bgColor: "bg-[#f7d51d]",
      hoverBg: "hover:bg-[#f2c409]",
      focusOutline: "focus:outline-[#f2c40960]",
      shadow: "shadow-[inset_-4px_-4px_#e59400]",
      hoverShadow: "hover:shadow-[inset_-6px_-6px_#e59400]",
      activeShadow: "active:shadow-[inset_6px_6px_#e59400]",
      border: "border-[#000]",
    },
    error: {
      color: "text-[#fff]",
      bgColor: "bg-[#e76e55]",
      hoverBg: "hover:bg-[#ce372b]",
      focusOutline: "focus:outline-[#ce372b60]",
      shadow: "shadow-[inset_-4px_-4px_#8c2022]",
      hoverShadow: "hover:shadow-[inset_-6px_-6px_#8c2022]",
      activeShadow: "active:shadow-[inset_6px_6px_#8c2022]",
      border: "border-[#000]",
    },
    disabled: {
      color: "text-[#afb0b2]",
      bgColor: "bg-[#d3d3d3]",
      hoverBg: "",
      focusOutline: "",
      shadow: "shadow-[inset_-4px_-4px_#adafbc]",
      hoverShadow: "",
      activeShadow: "",
      border: "border-[#7a7c7f]",
    },
  };

  const {
    color,
    bgColor,
    shadow,
    hoverBg,
    hoverShadow,
    focusOutline,
    activeShadow,
    border,
  } = typeStyles[props.type] || typeStyles.normal;

  return props.type === "file" ? (
    <label
      className={`relative cursor-pointer whitespace-nowrap px-3 py-3 text-base capitalize focus:outline focus:outline-[6px] ${
        props.type === "disabled" ? "cursor-not-allowed" : ""
      } ${color} ${bgColor} ${shadow} ${hoverBg} ${hoverShadow} ${focusOutline} ${activeShadow}`}
    >
      <span
        className={`h-[calc(100% + 8px)] border-y-4 px-3 py-2 ${border} pointer-events-none absolute left-[0px] top-[-4px] w-[100%]`}
      ></span>

      <span
        className={`w-[calc(100% + 8px)] border-x-4 px-3 py-2 ${border} pointer-events-none absolute left-[-4px] top-[0px] h-[100%]`}
      ></span>

      {props.type === "file" ? (
        <input type="file" className="pointer-events-none absolute opacity-0" />
      ) : (
        <></>
      )}
      {content}
    </label>
  ) : (
    <button
      type="button"
      className={`relative whitespace-nowrap px-3 py-3 text-base capitalize focus:outline focus:outline-[6px] ${
        props.type === "disabled" ? "cursor-not-allowed" : ""
      } ${color} ${bgColor} ${shadow} ${hoverBg} ${hoverShadow} ${focusOutline} ${activeShadow}`}
    >
      <span
        className={`h-[calc(100% + 8px)] border-y-4 px-3 py-2 ${border} pointer-events-none absolute left-[0px] top-[-4px] w-[100%]`}
      ></span>

      <span
        className={`w-[calc(100% + 8px)] border-x-4 px-3 py-2 ${border} pointer-events-none absolute left-[-4px] top-[0px] h-[100%]`}
      ></span>

      {props.type === "file" ? (
        <input type="file" className="pointer-events-none absolute opacity-0" />
      ) : (
        <></>
      )}
      {content}
    </button>
  );
}
