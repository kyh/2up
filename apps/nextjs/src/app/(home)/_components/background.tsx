"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";

export const Background = memo(
  () => (
    <div className="pointer-events-none fixed inset-0 h-screen w-full">
      <StarBackground />
      <ShootingStars />
    </div>
  ),
  () => true,
);

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

export const ShootingStars = memo(
  () => {
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
        className="absolute top-0 left-0 [image-rendering:pixelated]"
      >
        {stars.map((star) => renderPixelatedStar(star))}
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#ffffff", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#AAFFFF", stopOpacity: 0.8 }}
            />
          </linearGradient>
        </defs>
      </svg>
    );
  },
  () => true,
);

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

// Configuration constants
const starDensity = 0.00004; // Reduced density for larger stars
const twinkleProbability = 0.7;
const minTwinkleSpeed = 2;
const maxTwinkleSpeed = 4;
const pixelSize = 5;
const starRegenerationInterval = 5000; // Interval to regenerate stars (in ms)
const percentToRegenerate = 0.15; // Percentage of stars to regenerate at each interval

export const StarBackground = memo(
  () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // This effect only handles the initial rendering and window resize
      // It doesn't use React state
      const updateStars = () => {
        if (!containerRef.current || !svgRef.current) return;

        // Clear any existing stars
        while (svgRef.current.firstChild) {
          svgRef.current.removeChild(svgRef.current.firstChild);
        }

        // Get current dimensions
        const { width, height } = containerRef.current.getBoundingClientRect();

        // Create background rect
        const bgRect = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        bgRect.setAttribute("width", "100%");
        bgRect.setAttribute("height", "100%");
        bgRect.setAttribute("fill", "none");
        svgRef.current.appendChild(bgRect);

        // Generate and add stars
        const area = width * height;
        const numStars = Math.floor(area * starDensity);

        for (let i = 0; i < numStars; i++) {
          createAndAddStar(width, height);
        }
      };

      // Helper function to create and add a star to the SVG
      const createAndAddStar = (width: number, height: number) => {
        if (!svgRef.current) return;

        // Create star
        const shouldTwinkle = Math.random() < twinkleProbability;
        const gridX =
          Math.floor(Math.random() * (width / pixelSize)) * pixelSize;
        const gridY =
          Math.floor(Math.random() * (height / pixelSize)) * pixelSize;
        const colorIndex = Math.floor(Math.random() * STAR_COLORS.length);
        const opacity = Math.random() * 0.5 + 0.5;

        const star = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "rect",
        );
        star.setAttribute("x", gridX.toString());
        star.setAttribute("y", gridY.toString());
        star.setAttribute("width", pixelSize.toString());
        star.setAttribute("height", pixelSize.toString());
        star.setAttribute("fill", STAR_COLORS[colorIndex]!);
        star.setAttribute("opacity", opacity.toString());
        star.setAttribute("class", "star"); // Add a class for easier selection

        // Add twinkling animation if needed
        if (shouldTwinkle) {
          const twinkleSpeed =
            minTwinkleSpeed +
            Math.random() * (maxTwinkleSpeed - minTwinkleSpeed);
          const animate = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "animate",
          );
          animate.setAttribute("attributeName", "opacity");
          animate.setAttribute(
            "values",
            `${opacity};${opacity * 0.3};${opacity}`,
          );
          animate.setAttribute("dur", `${twinkleSpeed}s`);
          animate.setAttribute("repeatCount", "indefinite");
          animate.setAttribute("keyTimes", "0;0.5;1");
          animate.setAttribute("calcMode", "discrete");

          star.appendChild(animate);
        }

        svgRef.current.appendChild(star);
      };

      // Function to regenerate a portion of stars
      const regenerateStars = () => {
        if (!svgRef.current || !containerRef.current) return;

        const stars = svgRef.current.querySelectorAll(".star");
        if (stars.length === 0) return;

        // Calculate how many stars to regenerate
        const numToRegenerate = Math.max(
          1,
          Math.floor(stars.length * percentToRegenerate),
        );

        // Get dimensions
        const { width, height } = containerRef.current.getBoundingClientRect();

        // Randomly select stars to remove and replace
        const starsArray = Array.from(stars);
        for (let i = 0; i < numToRegenerate; i++) {
          const randomIndex = Math.floor(Math.random() * starsArray.length);
          if (randomIndex < starsArray.length) {
            const starToRemove = starsArray[randomIndex];
            if (starToRemove?.parentNode) {
              starToRemove.parentNode.removeChild(starToRemove);
              // Replace with a new star at a different position
              createAndAddStar(width, height);
              // Update our array to avoid trying to remove the same star twice
              starsArray.splice(randomIndex, 1);
            }
          }
        }
      };

      // Initial render
      updateStars();

      // Handle window resize
      const resizeObserver = new ResizeObserver(() => {
        updateStars();
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      // Set up interval to regenerate stars
      const regenerationInterval = setInterval(
        regenerateStars,
        starRegenerationInterval,
      );

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
        clearInterval(regenerationInterval);
      };
    }, []);

    return (
      <div ref={containerRef} className="h-full w-full">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="bg-transparent [image-rendering:pixelated]"
          preserveAspectRatio="none"
        />
      </div>
    );
  },
  () => true,
);
