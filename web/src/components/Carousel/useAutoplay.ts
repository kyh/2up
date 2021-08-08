import React from "react";
import { MotionValue } from "framer-motion";
import { animateSpring } from "styles/animations";

interface Controls {
  stop: () => void;
  start: () => void;
}

export function useAutoplay(
  index: MotionValue<number>,
  interval: number
): Controls {
  const timer = React.useRef<number>(0);

  const stop = React.useCallback(() => {
    if (!timer.current) {
      return;
    }

    window.clearInterval(timer.current);
    timer.current = 0;
  }, [timer]);

  const start = React.useCallback(() => {
    stop();

    if (!interval) {
      return;
    }

    timer.current = window.setInterval(() => {
      animateSpring(index, Math.floor(index.get() + 1));
    }, interval);
  }, [index, interval, timer, stop]);

  React.useEffect(() => {
    start();

    return (): void => {
      stop();
    };
  }, [start, stop]);

  return { start, stop };
}
