import React, { useCallback, useImperativeHandle } from "react";
import { PanHandlers, motion, useMotionValue } from "framer-motion";
import { animateSpring } from "styles/animations";
import { Slider } from "./Slider";
import { useAutoplay } from "./useAutoplay";
import { useOnChange } from "./useOnChange";
import { OnPan, usePan } from "./usePan";

const MotionSlider = motion(Slider);

export interface BaseCarouselHandle {
  slideNext: () => void;
  slidePrev: () => void;
  slideTo: (index: number) => void;
}

interface Props {
  autoplayInterval?: number;
  children?: React.ReactNode;
  className?: string;
  count?: number;
  draggable?: boolean;
  margin?: number;
  style?: React.CSSProperties;
  onChange?: (index: number) => void;
}

export const BaseCarousel = React.forwardRef<BaseCarouselHandle, Props>(
  (
    {
      autoplayInterval = 0,
      count = 1,
      children,
      draggable = true,
      margin = 0,
      onChange,
      ...props
    },
    ref: React.Ref<BaseCarouselHandle>
  ) => {
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const index = useMotionValue(0);

    useOnChange({
      childrenCount: React.Children.count(children),
      index,
      onChange,
    });

    const autoplay = useAutoplay(index, autoplayInterval);

    useImperativeHandle(
      ref,
      () => ({
        slideNext: (): void => {
          autoplay.start();

          const roundIndex = Number(index.get().toFixed(4));

          animateSpring(index, Math.ceil(roundIndex + 1));
        },
        slidePrev: (): void => {
          autoplay.start();

          const roundIndex = Number(index.get().toFixed(4));

          animateSpring(index, Math.floor(roundIndex - 1));
        },
        slideTo: (newIndex: number): void => {
          autoplay.start();

          animateSpring(index, newIndex);
        },
      }),
      [autoplay, index]
    );

    const panHandlers = usePan({
      count,
      index,
      margin,
      ref: sliderRef,
    });

    const onPanStart: OnPan = useCallback(
      (...args) => {
        autoplay.stop();

        panHandlers.onPanStart(...args);
      },
      [autoplay, panHandlers]
    );

    const onPanEnd: OnPan = useCallback(
      (...args) => {
        autoplay.start();

        panHandlers.onPanEnd(...args);
      },
      [autoplay, panHandlers]
    );

    let panProps: PanHandlers = {};
    if (draggable) {
      panProps = {
        onPanStart,
        onPan: panHandlers.onPan,
        onPanEnd,
      };
    }

    return (
      <MotionSlider
        ref={sliderRef}
        index={index}
        count={count}
        margin={margin}
        {...panProps}
        {...props}
      >
        {children}
      </MotionSlider>
    );
  }
);
