import { useEffect } from "react";
import { MotionValue } from "framer-motion";

interface Config {
  childrenCount: number;
  index: MotionValue<number>;
  onChange?: (index: number) => void;
}

export function useOnChange({ childrenCount, index, onChange }: Config): void {
  useEffect(() => {
    let prevIndex = 0;

    const unsubscribe = index.onChange((value) => {
      if (!onChange) {
        return;
      }

      const newIndex =
        ((Math.round(value) % childrenCount) + childrenCount) % childrenCount;
      if (newIndex === prevIndex) {
        return;
      }

      prevIndex = newIndex;

      onChange(newIndex);
    });

    return () => {
      unsubscribe();
    };
  }, [index, childrenCount, onChange]);
}
