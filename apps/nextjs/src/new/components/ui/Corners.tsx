import React from "react";
import clsx from "clsx";

interface CornerProps {
  type: "normal" | "dark";
  yside: "top" | "bottom";
  xside: "left" | "right";
}

const Corner = ({ type, yside, xside }: CornerProps) => {
  const innerBG = type === "dark" ? "bg-light" : "bg-dark";
  // const outerBG = type === "dark" ? "bg-dark" : "bg-light";
  const outerBG = type === "dark" ? "" : "";

  return (
    <span
      className={clsx(
        innerBG,
        yside === "top" ? "top-0" : "bottom-0",
        xside === "right" ? "right-0" : "left-0",
        "absolute h-1 w-1",
      )}
    ></span>
  );
};

interface YCornersProps {
  type: "normal" | "dark";
  yside: "top" | "bottom";
}

const YCorners: React.FC<YCornersProps> = ({ type, yside }) => {
  const xsides: ("left" | "right")[] = ["left", "right"];
  return (
    <>
      {xsides.map((xside) => (
        <Corner key={xside} type={type} yside={yside} xside={xside} />
      ))}
    </>
  );
};

interface EdgesProps {
  type: "normal" | "dark";
}

const Edges: React.FC<EdgesProps> = ({ type }) => {
  const spanStyles: { [key: string]: string } = {
    normal: "border-dark",
    dark: "border-light",
  };

  const spanClasses = spanStyles[type] || spanStyles.normal;

  return (
    <>
      <span
        className={clsx(
          spanClasses,
          "pointer-events-none absolute left-[4px] top-[-4px] h-[calc(100%+8px)] w-[calc(100%-8px)] border-y-4 px-3 py-2",
        )}
      ></span>

      <span
        className={clsx(
          spanClasses,
          "pointer-events-none absolute left-[-4px] top-[4px] h-[calc(100%-8px)] w-[calc(100%+8px)] border-x-4 px-3 py-2",
        )}
      ></span>
    </>
  );
};

interface CornerShapesProps {
  type: "normal" | "dark";
  edges?: boolean;
}

const CornerShapes: React.FC<CornerShapesProps> = ({ type, edges }) => {
  const ysides: ("top" | "bottom")[] = ["top", "bottom"];

  return (
    <>
      {ysides.map((yside) => (
        <YCorners key={yside} type={type} yside={yside} />
      ))}
      {!edges && <Edges type={type} />}
    </>
  );
};

export default CornerShapes;
