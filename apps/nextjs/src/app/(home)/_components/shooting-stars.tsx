"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ShootingStar = {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
  trail: { x: number; y: number; opacity: number }[];
};

const getRandomStartPoint = () => {
  const side = Math.floor(Math.random() * 4);
  const offset = Math.random() * window.innerWidth;

  switch (side) {
    case 0: // Top
      return { x: offset, y: 0, angle: 45 };
    case 1: // Right
      return { x: window.innerWidth, y: offset, angle: 135 };
    case 2: // Bottom
      return { x: offset, y: window.innerHeight, angle: 225 };
    case 3: // Left
      return { x: 0, y: offset, angle: 315 };
    default:
      return { x: 0, y: 0, angle: 45 };
  }
};

export const ShootingStars = () => {
  const [stars, setStars] = useState<ShootingStar[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const lastRenderTimeRef = useRef<number>(0);
  const targetFps = 16; // 16 FPS for that retro feel
  const frameInterval = 1000 / targetFps;

  // Create a new star with trail
  const createNewStar = useCallback(() => {
    const { x, y, angle } = getRandomStartPoint();
    return {
      id: Date.now(),
      x,
      y,
      angle,
      scale: 1,
      speed: Math.random() * 10 + 8,
      distance: 0,
      trail: [], // Empty trail initially
    };
  }, []);

  useEffect(() => {
    const createStar = () => {
      const newStar = createNewStar();
      setStars((prev) => [...prev, newStar]);

      // Set a random delay (between 2 and 6 seconds) for creating the next star
      const randomDelay = Math.random() * 4000 + 2000;
      setTimeout(createStar, randomDelay);
    };

    createStar();
  }, [createNewStar]);

  useEffect(() => {
    const moveStars = (timestamp: number) => {
      // Skip frames to limit to 16 FPS
      if (timestamp - lastRenderTimeRef.current < frameInterval) {
        requestAnimationFrame(moveStars);
        return;
      }

      lastRenderTimeRef.current = timestamp;

      setStars((prevStars) => {
        if (!prevStars.length) return prevStars;

        return prevStars
          .map((star) => {
            // Calculate new position
            const newX =
              star.x + star.speed * Math.cos((star.angle * Math.PI) / 180);
            const newY =
              star.y + star.speed * Math.sin((star.angle * Math.PI) / 180);
            const newDistance = star.distance + star.speed;

            // Add current position to trail
            const newTrail = [...star.trail];

            // Only add to trail every few frames for pixelated effect
            if (newDistance % 8 < star.speed) {
              newTrail.push({
                x: star.x,
                y: star.y,
                opacity: 1.0,
              });
            }

            // Update trail opacity and remove old trail pieces
            const updatedTrail = newTrail
              .map((point) => ({ ...point, opacity: point.opacity - 0.1 }))
              .filter((point) => point.opacity > 0);

            return {
              ...star,
              x: newX,
              y: newY,
              distance: newDistance,
              trail: updatedTrail,
            };
          })
          .filter(
            (star) =>
              // Remove stars that are out of bounds
              star.x >= -30 &&
              star.x <= window.innerWidth + 30 &&
              star.y >= -30 &&
              star.y <= window.innerHeight + 30,
          );
      });

      requestAnimationFrame(moveStars);
    };

    const animationId = requestAnimationFrame(moveStars);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Pixelated star representation
  const renderPixelatedStar = (star: ShootingStar) => {
    const pixelSize = 2; // Size of each "pixel"
    const starWidth = 4; // 4 pixels wide
    const starHeight = 2; // 2 pixels high

    // Create a pattern of pixels to form the star
    const pixels = [];
    for (let y = 0; y < starHeight; y++) {
      for (let x = 0; x < starWidth; x++) {
        // Skip some pixels for pixelated look
        if ((x === 0 && y === 1) || (x === 3 && y === 0)) continue;

        pixels.push(
          <rect
            key={`star-${star.id}-pixel-${x}-${y}`}
            x={star.x + x * pixelSize}
            y={star.y + y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill="#ffffff"
            transform={`rotate(${star.angle}, ${star.x}, ${star.y})`}
          />,
        );
      }
    }

    // Render trail as pixelated blocks
    const trail = star.trail.map((point, index) => (
      <rect
        key={`trail-${star.id}-${index}`}
        x={point.x}
        y={point.y}
        width={pixelSize}
        height={pixelSize}
        fill={`rgba(180, 242, 255, ${point.opacity})`}
        transform={`rotate(${star.angle}, ${point.x}, ${point.y})`}
      />
    ));

    return [...trail, ...pixels];
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        imageRendering: "pixelated",
      }}
    >
      {stars.map((star) => renderPixelatedStar(star))}
      <defs>
        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#AAFFFF", stopOpacity: 0.8 }}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};
