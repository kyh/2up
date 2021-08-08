import React, { useCallback, useMemo, useState } from "react";
import { MotionValue, PanInfo } from "framer-motion";
import { animateSpring } from "styles/animations";

export type OnPan = (
  event: MouseEvent | TouchEvent | PointerEvent,
  info: PanInfo
) => void;

interface Config {
  count: number;
  index: MotionValue<number>;
  margin: number;
  ref: React.RefObject<HTMLElement>;
}

interface Result {
  onPanStart: OnPan;
  onPan: OnPan;
  onPanEnd: OnPan;
}

function calcItemWidth(
  ref: React.RefObject<HTMLElement>,
  count: number,
  margin: number
): number {
  if (!ref.current) {
    return 0;
  }

  const { width } = ref.current.getBoundingClientRect();

  return (width - margin * (count - 1)) / count + margin;
}

export function usePan({ count, index, margin, ref }: Config): Result {
  const [initial] = useState(() => ({
    dragging: false,
    index: index.get(),
    itemWidth: calcItemWidth(ref, count, margin),
  }));

  const onTouchMove = useCallback((event: TouchEvent) => {
    // Prevent vertical scroll on mobile
    event.preventDefault();
  }, []);

  const onPanStart = useCallback(() => {
    initial.dragging = true;
    initial.index = index.get();
    initial.itemWidth = calcItemWidth(ref, count, margin);

    document.documentElement.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
  }, [ref, count, index, initial, margin, onTouchMove]);

  const onPan = useCallback(
    (_, info: PanInfo) => {
      const newIndex = initial.index - info.offset.x / initial.itemWidth;

      index.set(newIndex);
    },
    [index, initial]
  );

  const onPanEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      // Prevent click after drag
      initial.dragging = false;

      if (event instanceof MouseEvent) {
        event.target?.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
          },
          { once: true }
        );
      }

      // Adjust position
      let newIndex: number;

      if (info.velocity.x > 100) {
        newIndex = Math.floor(index.get());
      } else if (info.velocity.x < -100) {
        newIndex = Math.ceil(index.get());
      } else {
        newIndex = Math.round(index.get());
      }

      animateSpring(index, newIndex);

      document.documentElement.removeEventListener("touchmove", onTouchMove);
    },
    [index, initial, onTouchMove]
  );

  return useMemo(
    () => ({
      onPanStart,
      onPan,
      onPanEnd,
    }),
    [onPanStart, onPan, onPanEnd]
  );
}
