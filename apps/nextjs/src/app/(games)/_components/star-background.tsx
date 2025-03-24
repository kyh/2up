"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 16-bit color palette (reduced color options)
const STAR_COLORS = [
  "#FFFFFF", // White
  "#FFFFAA", // Light yellow
  "#AAAAFF", // Light blue
  "#FFAAAA", // Light red
  "#AAFFAA", // Light green
  "#FFAAFF", // Light purple
  "#AAFFFF", // Light cyan
];

type StarProps = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number | null;
  color: string;
};

const PixelatedStar = ({
  x,
  y,
  size,
  opacity,
  twinkleSpeed,
  color,
}: StarProps) => (
  <rect x={x} y={y} width={size} height={size} fill={color} opacity={opacity}>
    {twinkleSpeed !== null && (
      <animate
        attributeName="opacity"
        values={`${opacity};${opacity * 0.3};${opacity}`}
        dur={`${twinkleSpeed}s`}
        repeatCount="indefinite"
        // 16 FPS animation (keyTimes attribute helps control frame rate)
        keyTimes="0;0.5;1"
        calcMode="discrete"
      />
    )}
  </rect>
);

type StarBackgroundProps = {
  starDensity?: number;
  allStarsTwinkle?: boolean;
  twinkleProbability?: number;
  minTwinkleSpeed?: number;
  maxTwinkleSpeed?: number;
  pixelSize?: number;
};

export const StarBackground = ({
  starDensity = 0.00008, // Reduced density for larger stars
  allStarsTwinkle = true,
  twinkleProbability = 0.7,
  minTwinkleSpeed = 0.5,
  maxTwinkleSpeed = 1,
  pixelSize = 5, // Default 10px square stars
}: StarBackgroundProps) => {
  const [stars, setStars] = useState<StarProps[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateStars = useCallback(
    (width: number, height: number): StarProps[] => {
      const area = width * height;
      const numStars = Math.floor(area * starDensity);
      return Array.from({ length: numStars }, () => {
        const shouldTwinkle =
          allStarsTwinkle || Math.random() < twinkleProbability;

        // Position stars on a grid to enhance the pixelated look
        const gridX =
          Math.floor(Math.random() * (width / pixelSize)) * pixelSize;
        const gridY =
          Math.floor(Math.random() * (height / pixelSize)) * pixelSize;

        // Select a random color from the 16-bit palette
        const colorIndex = Math.floor(Math.random() * STAR_COLORS.length);

        return {
          x: gridX,
          y: gridY,
          size: pixelSize,
          opacity: Math.random() * 0.5 + 0.5, // Random opacity between 0.5 and 1
          twinkleSpeed: shouldTwinkle
            ? minTwinkleSpeed +
              Math.random() * (maxTwinkleSpeed - minTwinkleSpeed)
            : null,
          color: STAR_COLORS[colorIndex]!,
        };
      });
    },
    [
      allStarsTwinkle,
      maxTwinkleSpeed,
      minTwinkleSpeed,
      starDensity,
      twinkleProbability,
      pixelSize,
    ],
  );

  useEffect(() => {
    const updateStars = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setStars(generateStars(width, height));
      }
    };

    updateStars(); // Initial generation

    const resizeObserver = new ResizeObserver(updateStars);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [
    starDensity,
    allStarsTwinkle,
    twinkleProbability,
    minTwinkleSpeed,
    maxTwinkleSpeed,
    generateStars,
  ]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <svg
        width="100%"
        height="100%"
        style={{
          backgroundColor: "transparent",
          imageRendering: "pixelated",
        }}
        preserveAspectRatio="none"
      >
        <rect width="100%" height="100%" fill="none" />
        {stars.map((star, index) => (
          <PixelatedStar key={index} {...star} />
        ))}
      </svg>
    </div>
  );
};
