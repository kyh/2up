"use client";

import { useEffect, useRef } from "react";
import usePartySocket from "partysocket/react";

import { Background } from "@/app/(home)/_components/background";

const Page = () => {
  return (
    <>
      <DemoGame />
      <Background />
    </>
  );
};

type Point = {
  x: number;
  y: number;
};

type Ship = {
  id: string | null;
  position: Point;
  size: number;
  path: Point[];
  referencePath: Point[];
  angle: number;
  velocity: Point;
  lastPosition: Point;
  color: string;
  hue: string;
  targetPosition: Point;
};

type GameState = {
  context: CanvasRenderingContext2D | null;
  mouse: Point;
  myShip: Ship | null;
  otherShips: Record<string, Ship>;
  playerId: string | null;
  animationFrameId: number | null;
  lastUpdateTime: number;
};

type Player = {
  id: string;
  position: Point;
  color?: string;
  hue?: string;
};

type ServerMessage = {
  type: string;
  data: any;
};

const SHIP_SPEED = 2;
const PI = Math.PI;
const DEG_TO_RAD = PI / 180;

const HOST = "https://vg-partyserver.kyh.workers.dev";
const PARTY = "vg-server";
const ROOM = "home";

const DemoGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
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
    state.myShip = createShip(window.innerWidth / 2, window.innerHeight / 2, 8);

    const onOpen = () => {
      console.log("Connected to server");

      // Set player ID if available from socket
      if (socket.id && !state.playerId) {
        state.playerId = socket.id;
        updatePlayerCounter();
      }
    };

    const onMessage = (evt: MessageEvent) => {
      const message: ServerMessage = JSON.parse(evt.data);
      const state = gameStateRef.current;

      switch (message.type) {
        case "sync":
          // Initial sync of all players
          state.otherShips = {};

          // Process all players from sync data
          Object.entries(message.data).forEach(([id, playerData]) => {
            const player = playerData as Player;
            if (
              player.position?.x !== undefined &&
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
          const player: Player = message.data;
          if (
            player.id &&
            player.position?.x !== undefined &&
            player.position.y !== undefined
          ) {
            // If we already have this ship, update its target position
            if (state.otherShips[player.id]) {
              const ship = state.otherShips[player.id];
              if (ship) {
                ship.targetPosition = {
                  x: player.position.x,
                  y: player.position.y,
                };

                // Calculate direction vector for the ship to face
                if (
                  ship.position.x !== player.position.x ||
                  ship.position.y !== player.position.y
                ) {
                  const dx = player.position.x - ship.position.x;
                  const dy = player.position.y - ship.position.y;
                  ship.angle = Math.atan2(dy, dx);
                }
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
          if (message.data?.id && state.otherShips[message.data.id as string]) {
            delete state.otherShips[message.data.id as string];
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
  const createShipFromPlayer = (player: Player): Ship => {
    const ship = createShip(player.position.x, player.position.y, 8, player.id);

    // Add color information from the server
    ship.color = player.color || "rgb(255, 255, 255)";
    ship.hue = player.hue || "rgb(200, 200, 200)";

    // Add target position for smooth movement
    ship.targetPosition = { ...ship.position };

    return ship;
  };

  // Utility functions
  const createPoint = (x: number | Point = 0, y = 0): Point => {
    if (typeof x === "object" && x !== null) {
      return { x: x.x || 0, y: x.y || 0 };
    }
    return { x: x || 0, y: y || 0 };
  };

  const addPoints = (p1: Point, p2: Point): Point => ({
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  });
  const subPoints = (p1: Point, p2: Point): Point => ({
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  });
  const pointLength = (p: Point): number => Math.sqrt(p.x * p.x + p.y * p.y);

  const normalizePoint = (p: Point, thickness = 1): Point => {
    const len = pointLength(p);
    if (len === 0) return { x: 0, y: 0 };
    return {
      x: (p.x / len) * thickness,
      y: (p.y / len) * thickness,
    };
  };

  const pointAngle = (p: Point): number => Math.atan2(p.y, p.x);

  const polarToPoint = (length: number, angle: number): Point => ({
    x: length * Math.cos(angle),
    y: length * Math.sin(angle),
  });

  const createShip = (
    x: number,
    y: number,
    size: number,
    id: string | null = null,
  ): Ship => {
    const position = createPoint(x, y);
    const path: Point[] = [];
    const referencePath: Point[] = [];

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

  const updateShipPosition = (
    ship: Ship,
    target: Point,
    speed: number = SHIP_SPEED,
  ): Ship => {
    // Create a new ship object to maintain immutability
    const newShip: Ship = {
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

  const updateShipPath = (ship: Ship): Ship => {
    // Create hull drawing points based on ship's current angle
    const newShip: Ship = { ...ship };

    // Create reference path (points in local space)
    const referencePoints: Point[] = [];
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

  const drawShip = (ctx: CanvasRenderingContext2D, ship: Ship) => {
    if (!ship?.path || ship.path.length === 0) return;

    ctx.beginPath();
    ctx.strokeStyle = ship.color || "rgb(255, 255, 255)";
    ctx.lineWidth = 1;

    ctx.moveTo(ship.path[0]?.x ?? 0, ship.path[0]?.y ?? 0);

    for (let i = 1; i < ship.path.length; i++) {
      ctx.lineTo(ship.path[i]?.x ?? 0, ship.path[i]?.y ?? 0);
    }

    ctx.lineTo(ship.path[0]?.x ?? 0, ship.path[0]?.y ?? 0);
    ctx.stroke();
  };

  const updatePlayerCounter = () => {
    const state = gameStateRef.current;
    const playerCountElement = document.getElementById("player-count");
    const playerIdElement = document.getElementById("player-id");

    if (playerCountElement) {
      const count =
        Object.keys(state.otherShips).length + (state.myShip ? 1 : 0);
      playerCountElement.textContent = count.toString();
    }

    if (playerIdElement && state.playerId) {
      playerIdElement.textContent = state.playerId;
    }
  };

  // Initialize the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = gameStateRef.current;

    const context = canvas.getContext("2d");
    if (!context) return;

    state.context = context;

    // Set initial canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      state.mouse = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      state.mouse = {
        x: e.touches[0]?.clientX ?? 0,
        y: e.touches[0]?.clientY ?? 0,
      };
    };

    // Game loop
    const gameLoop = () => {
      if (!state.context) return;
      const { context, myShip, otherShips, mouse, lastUpdateTime } = state;
      const now = Date.now();

      // Clear canvas
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

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
            }),
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
          SHIP_SPEED * 0.8,
        );

        // Update ship's path based on new position and angle
        const finalShip = updateShipPath(updatedShip);

        // Update the ship in state
        state.otherShips[ship.id!] = finalShip;

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
      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }
    };
  }, [socket]);

  return <canvas ref={canvasRef} className="game" />;
};

export default Page;
