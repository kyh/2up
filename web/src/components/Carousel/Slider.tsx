import React from "react";
import {
  MotionStyle,
  MotionValue,
  motion,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
import { ItemWrapper } from "./ItemWrapper";

type Props = {
  children?: React.ReactNode;
  count: number;
  index: MotionValue<number>;
  margin: number;
  style?: React.CSSProperties;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Slider = React.forwardRef<HTMLDivElement, Props>(function Slider(
  { children, style = {}, margin, count, index, ...props },
  ref
): JSX.Element {
  const childrenCount = React.Children.count(children);
  const tail = childrenCount - count;
  const frameWidth = 100 / childrenCount;

  const startIndex = useTransform(index, (value) => {
    if (!tail) {
      return 0;
    }

    if (value >= 0) {
      return (Math.floor(value / tail) * tail) % childrenCount;
    }

    return (
      (childrenCount +
        ((Math.ceil(value / tail) * tail - tail) % childrenCount)) %
      childrenCount
    );
  });

  const translate = useTransform(index, (value) => {
    if (!tail) {
      return 0;
    }

    if (value >= 0) {
      return frameWidth * (value % tail);
    }

    return frameWidth * (tail + (value % tail));
  });

  const containerStyle = {
    ...style,
    overflow: "hidden",

    // https://github.com/framer/motion/issues/281
    touchAction: "pan-y",
  };

  const transform = useMotionTemplate`translateX(-${translate}%)`;

  const sliderStyle: MotionStyle = {
    height: "100%",
    transform,
    willChange: "transform",
    display: "flex",
    width: `calc(((100% - ${
      (count - 1) * margin
    }px) / ${count} + ${margin}px)*${childrenCount})`,
  };

  return (
    <div ref={ref} style={containerStyle} {...props}>
      <motion.div style={sliderStyle}>
        {React.Children.map(children, (child, i) => (
          <ItemWrapper
            childrenCount={childrenCount}
            index={i}
            margin={margin}
            startIndex={startIndex}
          >
            {child}
          </ItemWrapper>
        ))}
      </motion.div>
    </div>
  );
});
