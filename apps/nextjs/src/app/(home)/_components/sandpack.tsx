import { memo } from "react";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider as SandpackProviderPrimitive,
} from "@codesandbox/sandpack-react";
import { sandpackDark } from "@codesandbox/sandpack-themes";
import { dependencies } from "@repo/api/ai/prompt";

import type {
  SandpackFile,
  SandpackPreviewRef,
} from "@codesandbox/sandpack-react";

export const Preview = memo(function Preview({
  previewRef,
}: {
  previewRef: React.RefObject<SandpackPreviewRef | null>;
}) {
  return (
    <SandpackPreview
      ref={previewRef}
      showOpenInCodeSandbox={false}
      showRefreshButton={false}
      showRestartButton={false}
    />
  );
});

export const SandpackProvider = ({
  files = defaultFiles,
  children,
}: {
  files?: Record<string, SandpackFile>;
  children: React.ReactNode;
}) => {
  return (
    <SandpackProviderPrimitive
      template="react-ts"
      theme={sandpackDark}
      files={files}
      customSetup={{ dependencies }}
      options={{
        classes: {
          "sp-wrapper": "h-full!",
          "sp-layout": "block! border-0! h-full!",
          "sp-preview": "h-full!",
        },
      }}
    >
      <SandpackLayout>{children}</SandpackLayout>
    </SandpackProviderPrimitive>
  );
};

type SandpackFiles = Record<string, SandpackFile>;

export const defaultFiles: SandpackFiles = {
  "/styles.css": {
    code: `
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #000;
  background-image: url('https://vibedgames.com/home/bg.png');
  background-size: 10px;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  background: transparent;
  image-rendering: pixelated;
}

.game {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  image-rendering: pixelated;
  cursor: crosshair;
}
`,
  },
  "/Background.tsx": {
    code: `
import { memo, useCallback, useEffect, useRef } from "react";

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

// Shooting star configuration
const shootingStarPixelSize = 2;
const targetFps = 16; // 16 FPS for that retro feel

export const Background = memo(
  () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    // State references
    const backgroundStarsRef = useRef([]);
    const shootingStarsRef = useRef([]);
    const lastRenderTimeRef = useRef(0);
    const frameInterval = 1000 / targetFps;

    // Get random starting point for shooting stars
    const getRandomStartPoint = useCallback(() => {
      // Start from anywhere along the top edge
      const x = Math.random() * window.innerWidth;

      // Randomize the angle with a wider range (45-135 degrees)
      // 90 degrees is straight down
      // 45 degrees is down-right, 135 degrees is down-left
      const angle = 45 + Math.random() * 90;

      return { x, y: 0, angle };
    }, []);

    // Create a new shooting star
    const createNewShootingStar = useCallback(() => {
      const { x, y, angle } = getRandomStartPoint();
      return {
        id: Date.now(),
        x,
        y,
        angle,
        scale: 1,
        speed: Math.random() * 5 + 8,
        distance: 0,
        trail: [],
      };
    }, [getRandomStartPoint]);

    const initBackgroundStars = useCallback(() => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;

      // Clear existing stars
      backgroundStarsRef.current = [];

      // Generate new stars
      const area = canvas.width * canvas.height;
      const numStars = Math.floor(area * starDensity);

      for (let i = 0; i < numStars; i++) {
        const shouldTwinkle = Math.random() < twinkleProbability;
        const gridX =
          Math.floor(Math.random() * (canvas.width / pixelSize)) * pixelSize;
        const gridY =
          Math.floor(Math.random() * (canvas.height / pixelSize)) * pixelSize;
        const colorIndex = Math.floor(Math.random() * STAR_COLORS.length);
        const baseOpacity = Math.random() * 0.5 + 0.5;

        backgroundStarsRef.current.push({
          x: gridX,
          y: gridY,
          color: STAR_COLORS[colorIndex],
          baseOpacity,
          currentOpacity: baseOpacity,
          twinkle: shouldTwinkle,
          twinkleSpeed:
            minTwinkleSpeed +
            Math.random() * (maxTwinkleSpeed - minTwinkleSpeed),
          twinkleDirection: -1, // -1 fading out, 1 fading in
          twinkleTimer: 0,
        });
      }
    }, []);

    // Regenerate a portion of background stars
    const regenerateBackgroundStars = useCallback(() => {
      if (!canvasRef.current || backgroundStarsRef.current.length === 0) return;

      const canvas = canvasRef.current;
      const numToRegenerate = Math.max(
        1,
        Math.floor(backgroundStarsRef.current.length * percentToRegenerate)
      );

      for (let i = 0; i < numToRegenerate; i++) {
        const randomIndex = Math.floor(
          Math.random() * backgroundStarsRef.current.length
        );

        // Replace with a new star
        const shouldTwinkle = Math.random() < twinkleProbability;
        const gridX =
          Math.floor(Math.random() * (canvas.width / pixelSize)) * pixelSize;
        const gridY =
          Math.floor(Math.random() * (canvas.height / pixelSize)) * pixelSize;
        const colorIndex = Math.floor(Math.random() * STAR_COLORS.length);
        const baseOpacity = Math.random() * 0.5 + 0.5;

        backgroundStarsRef.current[randomIndex] = {
          x: gridX,
          y: gridY,
          color: STAR_COLORS[colorIndex],
          baseOpacity,
          currentOpacity: baseOpacity,
          twinkle: shouldTwinkle,
          twinkleSpeed:
            minTwinkleSpeed +
            Math.random() * (maxTwinkleSpeed - minTwinkleSpeed),
          twinkleDirection: -1,
          twinkleTimer: 0,
        };
      }
    }, []);

    // Main animation loop
    const animateCanvas = useCallback(
      (timestamp) => {
        // Skip frames to limit to target FPS
        if (timestamp - lastRenderTimeRef.current < frameInterval) {
          animationFrameRef.current = requestAnimationFrame(animateCanvas);
          return;
        }

        lastRenderTimeRef.current = timestamp;

        if (!canvasRef.current) {
          animationFrameRef.current = requestAnimationFrame(animateCanvas);
          return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw and update background stars
        backgroundStarsRef.current.forEach((star) => {
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.currentOpacity;
          ctx.fillRect(star.x, star.y, pixelSize, pixelSize);

          // Update twinkling
          if (star.twinkle) {
            // Update twinkle timer
            star.twinkleTimer += 1 / targetFps;

            if (star.twinkleTimer >= star.twinkleSpeed) {
              star.twinkleTimer = 0;
              star.twinkleDirection *= -1; // Reverse direction
            }

            // Calculate new opacity based on discrete steps
            const progress = star.twinkleTimer / star.twinkleSpeed;
            if (progress < 0.5) {
              star.currentOpacity =
                star.twinkleDirection < 0
                  ? star.baseOpacity
                  : star.baseOpacity * 0.3;
            } else {
              star.currentOpacity =
                star.twinkleDirection < 0
                  ? star.baseOpacity * 0.3
                  : star.baseOpacity;
            }
          }
        });

        // 2. Update shooting stars
        if (shootingStarsRef.current.length) {
          shootingStarsRef.current = shootingStarsRef.current
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
                star.y <= window.innerHeight + 30
            );

          // 3. Draw shooting stars
          shootingStarsRef.current.forEach((star) => {
            // Draw trail
            star.trail.forEach((point) => {
              ctx.save();
              ctx.translate(point.x, point.y);
              ctx.rotate((star.angle * Math.PI) / 180);
              ctx.translate(-point.x, -point.y);

              ctx.fillStyle = \`rgba(180, 242, 255, \${point.opacity})\`;
              ctx.fillRect(
                point.x,
                point.y,
                shootingStarPixelSize,
                shootingStarPixelSize
              );

              ctx.restore();
            });

            // Draw star (pixelated representation)
            const starWidth = 4; // 4 pixels wide
            const starHeight = 2; // 2 pixels high

            ctx.save();
            ctx.translate(star.x, star.y);
            ctx.rotate((star.angle * Math.PI) / 180);
            ctx.translate(-star.x, -star.y);

            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 1.0;

            for (let y = 0; y < starHeight; y++) {
              for (let x = 0; x < starWidth; x++) {
                // Skip some pixels for pixelated look
                if ((x === 0 && y === 1) || (x === 3 && y === 0)) continue;

                ctx.fillRect(
                  star.x + x * shootingStarPixelSize,
                  star.y + y * shootingStarPixelSize,
                  shootingStarPixelSize,
                  shootingStarPixelSize
                );
              }
            }

            ctx.restore();
          });
        }

        animationFrameRef.current = requestAnimationFrame(animateCanvas);
      },
      [frameInterval]
    );

    // Initialize the component
    useEffect(() => {
      if (!canvasRef.current) return;

      // Set canvas dimensions
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      // Initialize background stars
      initBackgroundStars();

      // Start animation loop
      animationFrameRef.current = requestAnimationFrame(animateCanvas);

      // Create shooting stars periodically
      const createShootingStar = () => {
        const newStar = createNewShootingStar();
        shootingStarsRef.current = [...shootingStarsRef.current, newStar];

        // Set a random delay for creating the next star
        const randomDelay = Math.random() * 4000 + 2000; // 2-6 seconds
        setTimeout(createShootingStar, randomDelay);
      };

      // Create first shooting star
      createShootingStar();

      // Set up regeneration interval for background stars
      const regenerationInterval = setInterval(
        regenerateBackgroundStars,
        starRegenerationInterval
      );

      // Handle window resize
      const handleResize = () => {
        if (canvasRef.current) {
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
          initBackgroundStars();
        }
      };

      window.addEventListener("resize", handleResize);

      // Cleanup
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        clearInterval(regenerationInterval);
        window.removeEventListener("resize", handleResize);
      };
    }, [
      animateCanvas,
      createNewShootingStar,
      initBackgroundStars,
      regenerateBackgroundStars,
    ]);

    return (
      <canvas ref={canvasRef} className="background" />
    );
  },
  () => true
);
`,
  },
  "/Game.tsx": {
    code: `
import { useEffect, useRef } from "react";
import usePartySocket from "partysocket/react";

const SHIP_SPEED = 2;
const PI = Math.PI;
const DEG_TO_RAD = PI / 180;
const FPS = 60;

const HOST = "https://vg-partyserver.kyh.workers.dev";
const PARTY = "vg-server";
const ROOM = "home";

export function Game() {
  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    context: null,
    mouse: { x: 0, y: 0 },
    myShip: null,
    otherShips: {},
    playerId: null,
    animationFrameId: null,
    lastUpdateTime: 0,
  });

  // Connect to your PartySocket server
  const socket = usePartySocket({
    host: HOST,
    party: PARTY,
    room: ROOM,
  });

  useEffect(() => {
    const state = gameStateRef.current;
    state.myShip = createShip(state.canvasWidth / 2, state.canvasHeight / 2, 8);

    const onOpen = () => {
      console.log("Connected to server");

      // Set player ID if available from socket
      if (socket.id && !state.playerId) {
        state.playerId = socket.id;
        updatePlayerCounter();
      }
    };

    const onMessage = (evt) => {
      const message = JSON.parse(evt.data);
      const state = gameStateRef.current;

      switch (message.type) {
        case "sync":
          // Initial sync of all players
          state.otherShips = {};

          // Process all players from sync data
          Object.entries(message.data).forEach(([id, player]) => {
            if (
              player.position &&
              player.position.x !== undefined &&
              player.position.y !== undefined
            ) {
              // Create ships for other players
              state.otherShips[id] = createShipFromPlayer(player);
            }
          });

          // Set my player ID based on socket connection if not already set
          if (!state.playerId && socket.id) {
            state.playerId = socket.id;
          }

          updatePlayerCounter();
          break;

        case "update":
          // Update a single player
          const player = message.data;
          if (
            player.id &&
            player.position &&
            player.position.x !== undefined &&
            player.position.y !== undefined
          ) {
            // If we already have this ship, update its target position
            if (state.otherShips[player.id]) {
              state.otherShips[player.id].targetPosition = {
                x: player.position.x,
                y: player.position.y,
              };

              // Calculate direction vector for the ship to face
              const ship = state.otherShips[player.id];
              if (
                ship.position.x !== player.position.x ||
                ship.position.y !== player.position.y
              ) {
                const dx = player.position.x - ship.position.x;
                const dy = player.position.y - ship.position.y;
                ship.angle = Math.atan2(dy, dx);
              }
            } else {
              // Create a new ship
              state.otherShips[player.id] = createShipFromPlayer(player);
            }
          }

          updatePlayerCounter();
          break;

        case "remove":
          // Remove a player
          if (
            message.data &&
            message.data.id &&
            state.otherShips[message.data.id]
          ) {
            delete state.otherShips[message.data.id];
            updatePlayerCounter();
          }
          break;
      }
    };

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
    };
  }, [socket]);

  // Create a ship from player data received from server
  const createShipFromPlayer = (player) => {
    const ship = createShip(player.position.x, player.position.y, 8, player.id);

    // Add color information from the server
    ship.color = player.color || "rgb(255, 255, 255)";
    ship.hue = player.hue || "rgb(200, 200, 200)";

    // Add target position for smooth movement
    ship.targetPosition = { ...ship.position };

    return ship;
  };

  // Utility functions
  const createPoint = (x = 0, y = 0) => {
    if (typeof x === "object" && x !== null) {
      return { x: x.x || 0, y: x.y || 0 };
    }
    return { x: x || 0, y: y || 0 };
  };

  const addPoints = (p1, p2) => ({ x: p1.x + p2.x, y: p1.y + p2.y });
  const subPoints = (p1, p2) => ({ x: p1.x - p2.x, y: p1.y - p2.y });
  const pointLength = (p) => Math.sqrt(p.x * p.x + p.y * p.y);

  const normalizePoint = (p, thickness = 1) => {
    const len = pointLength(p);
    if (len === 0) return { x: 0, y: 0 };
    return {
      x: (p.x / len) * thickness,
      y: (p.y / len) * thickness,
    };
  };

  const pointAngle = (p) => Math.atan2(p.y, p.x);

  const polarToPoint = (length, angle) => ({
    x: length * Math.cos(angle),
    y: length * Math.sin(angle),
  });

  const createShip = (x, y, size, id = null) => {
    const position = createPoint(x, y);
    const path = [];
    const referencePath = [];

    // Create hull drawing points
    const angles = [0, 140, 180, 220];

    angles.forEach((deg, i) => {
      const angle = DEG_TO_RAD * deg;
      const radius = i === 2 ? size / 2 : size;
      const point = addPoints(position, polarToPoint(radius, angle));
      path.push({ ...point });
      referencePath.push({ ...point });
    });

    return {
      id,
      position,
      size,
      path,
      referencePath,
      angle: 0,
      velocity: { x: 0, y: 0 },
      lastPosition: { ...position },
      color: "rgb(255, 255, 255)", // Default color
      hue: "rgb(200, 200, 200)", // Default hue
      targetPosition: { ...position }, // For smooth movement
    };
  };

  const updateShipPosition = (ship, target, speed = SHIP_SPEED) => {
    // Create a new ship object to maintain immutability
    const newShip = {
      ...ship,
      lastPosition: { ...ship.position },
    };

    // Calculate direction vector
    const v = subPoints(target, ship.position);
    const vlen = pointLength(v);

    // Update angle to face the direction of movement
    newShip.angle = pointAngle(v);

    // Normalize velocity if needed
    const velocity = vlen > speed ? normalizePoint(v, speed) : v;

    // Update position if far enough from target
    if (vlen > ship.size / 2) {
      newShip.position = addPoints(ship.position, velocity);
    }

    return newShip;
  };

  const updateShipPath = (ship) => {
    // Create hull drawing points based on ship's current angle
    const newShip = { ...ship };

    // Create reference path (points in local space)
    const referencePoints = [];
    const angles = [0, 140, 180, 220];

    angles.forEach((deg, i) => {
      const angle = DEG_TO_RAD * deg;
      const radius = i === 2 ? ship.size / 2 : ship.size;
      referencePoints.push(polarToPoint(radius, angle));
    });

    // Rotate and position the path points
    const cos = Math.cos(ship.angle);
    const sin = Math.sin(ship.angle);

    newShip.path = referencePoints.map((rp) => ({
      x: ship.position.x + rp.x * cos - rp.y * sin,
      y: ship.position.y + rp.x * sin + rp.y * cos,
    }));

    return newShip;
  };

  const drawShip = (ctx, ship) => {
    if (!ship || !ship.path || ship.path.length === 0) return;

    ctx.beginPath();
    ctx.strokeStyle = ship.color || "rgb(255, 255, 255)";
    ctx.lineWidth = 1;

    ctx.moveTo(ship.path[0].x, ship.path[0].y);

    for (let i = 1; i < ship.path.length; i++) {
      ctx.lineTo(ship.path[i].x, ship.path[i].y);
    }

    ctx.lineTo(ship.path[0].x, ship.path[0].y);
    ctx.stroke();
  };

  const updatePlayerCounter = () => {
    const state = gameStateRef.current;
    const playerCountElement = document.getElementById("player-count");
    const playerIdElement = document.getElementById("player-id");

    if (playerCountElement) {
      const count =
        Object.keys(state.otherShips).length + (state.myShip ? 1 : 0);
      playerCountElement.textContent = count;
    }

    if (playerIdElement && state.playerId) {
      playerIdElement.textContent = state.playerId;
    }
  };

  // Initialize the game
  useEffect(() => {
    const canvas = canvasRef.current;
    const state = gameStateRef.current;

    state.context = canvas.getContext("2d");

    // Set initial canvas dimensions
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;

    // Handle window resize
    const handleResize = () => {
      state.canvasWidth = window.innerWidth;
      state.canvasHeight = window.innerHeight;
      canvas.width = state.canvasWidth;
      canvas.height = state.canvasHeight;
    };

    // Handle mouse movement
    const handleMouseMove = (e) => {
      state.mouse = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      state.mouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    // Game loop
    const gameLoop = () => {
      const {
        context,
        myShip,
        otherShips,
        canvasWidth,
        canvasHeight,
        mouse,
        lastUpdateTime,
      } = state;
      const now = Date.now();

      // Clear canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // Update and draw my ship
      if (myShip) {
        // Update ship position based on mouse position
        const updatedShip = updateShipPosition(myShip, mouse);

        // Update ship's path based on new position and angle
        state.myShip = updateShipPath(updatedShip);

        // Draw the ship
        drawShip(context, state.myShip);

        // Send position to server (throttle to every 50ms to match server expectations)
        if (socket.readyState === WebSocket.OPEN && now - lastUpdateTime > 50) {
          socket.send(
            JSON.stringify({
              type: "position",
              data: {
                x: state.myShip.position.x,
                y: state.myShip.position.y,
                pointer: "mouse",
                pathname: window.location.pathname,
              },
            })
          );

          state.lastUpdateTime = now;
        }
      }

      // Update and draw other ships
      Object.values(otherShips).forEach((ship) => {
        // Smoothly move other ships toward their target positions
        const updatedShip = updateShipPosition(
          ship,
          ship.targetPosition,
          SHIP_SPEED * 0.8
        );

        // Update ship's path based on new position and angle
        const finalShip = updateShipPath(updatedShip);

        // Update the ship in state
        state.otherShips[ship.id] = finalShip;

        // Draw the ship
        drawShip(context, finalShip);
      });

      // Continue animation loop
      state.animationFrameId = requestAnimationFrame(gameLoop);
    };

    // Add event listeners
    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Start game loop
    state.animationFrameId = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(state.animationFrameId);
    };
  }, [socket]);

  return (
    <canvas ref={canvasRef} className="game" />
  );
}
`,
  },
  "/App.tsx": {
    code: `
import { Background } from "./Background";
import { Game } from "./Game";

const App = () => {
  return (
    <>
      <Game />
      <Background />
    </>
  )
}

export default App;
`,
  },
};

export type { SandpackFiles, SandpackPreviewRef };
