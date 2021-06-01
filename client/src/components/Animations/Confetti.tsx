import { useRef, useEffect } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const Confetti = () => {
  const instance = useRef<any>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      requestAnimationFrame(fire);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const makeShot = (particleRatio: number, opts = {}) => {
    instance &&
      instance.current({
        ...opts,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
        particleCount: Math.floor(200 * particleRatio),
      });
  };

  const fire = () => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <ReactCanvasConfetti
      refConfetti={(canvas) => (instance.current = canvas)}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
      }}
    />
  );
};
