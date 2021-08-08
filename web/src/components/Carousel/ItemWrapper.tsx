import React from "react";
import {
  MotionStyle,
  MotionValue,
  motion,
  useMotionTemplate,
  useTransform,
} from "framer-motion";

interface Props {
  children: React.ReactNode;
  childrenCount: number;
  index: number;
  margin: number;
  startIndex: MotionValue<number>;
}

export function ItemWrapper({
  children,
  childrenCount,
  index,
  margin,
  startIndex,
}: Props): JSX.Element {
  const pos = useTransform(
    startIndex,
    (value) => (value <= index ? -value : childrenCount - value) * 100
  );
  const transform = useMotionTemplate`translateX(${pos}%)`;

  const style: MotionStyle = {
    boxSizing: "border-box",
    flex: 1,
    transform,
    willChange: "transform",
    paddingRight: margin,
  };

  return <motion.div style={style}>{children}</motion.div>;
}
