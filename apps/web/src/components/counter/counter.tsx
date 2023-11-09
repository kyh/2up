"use client";

import { animate } from "framer-motion";
import { useEffect, useRef } from "react";

type Props = {
  from: number;
  to: number;
};

export const Counter = ({ from, to }: Props) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = nodeRef.current;

    const controls = animate(from, to, {
      duration: 1,
      onUpdate(value) {
        if (node) {
          node.textContent = value.toFixed(0);
        }
      },
    });

    return () => controls.stop();
  }, [from, to]);

  return <span ref={nodeRef} />;
};
