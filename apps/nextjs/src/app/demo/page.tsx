"use client";

import { useEffect, useRef, useState } from "react";
import {
  usePlayroomRoot,
  usePlayersList,
  usePlayerState,
  useMyPlayer,
} from "@repo/multiplayer";

import { Background } from "@/app/(home)/_components/background";

const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8787"
    : "https://vg-partyserver.kyh.workers.dev";
const PARTY = "vg-server";
const ROOM = "home";

const Page = () => {
  return (
    <>
      <PlayroomProvider />
      <Background />
    </>
  );
};

// Root component that establishes the playroom connection
const PlayroomProvider = () => {
  const game = usePlayroomRoot({
    host: HOST,
    party: PARTY,
    room: ROOM,
  });

  if (!game.isConnected) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">Connecting to playroom...</div>
          <div className="text-sm text-gray-500">Status: {game.connectionStatus}</div>
        </div>
      </div>
    );
  }

  return <DemoGame gameRoot={game} />;
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

const SHIP_SPEED = 2;
const PI = Math.PI;
const DEG_TO_RAD = PI / 180;

const DemoGame = ({ gameRoot }: { gameRoot: any }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shipsRef = useRef<Record<string, Ship>>({});
  const myShipRef = useRef<Ship | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });

  // Use PlayroomKit-style hooks
  const players = usePlayersList(true);
  const myPlayer = useMyPlayer();

  // Use player state for position tracking
  const [myPosition, setMyPosition] = usePlayerState(
    myPlayer,
    "position",
    { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400, 
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300 }
  );

  // Handle mouse movement and update position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePosition(newPos);
      setMyPosition(newPos);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        const newPos = { x: touch.clientX, y: touch.clientY };
        setMousePosition(newPos);
        setMyPosition(newPos);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [setMyPosition]);

  // Initialize my ship
  useEffect(() => {
    if (gameRoot.isConnected && !myShipRef.current && myPlayer) {
      myShipRef.current = createShip(
        myPosition.x,
        myPosition.y,
        8,
        myPlayer.id,
      );
    }
  }, [gameRoot.isConnected, myPlayer, myPosition]);

  // Update ships based on player list changes
  useEffect(() => {
    // Remove ships for players that left
    Object.keys(shipsRef.current).forEach(shipId => {
      if (!players.find(p => p.id === shipId) && shipId !== myPlayer?.id) {
        delete shipsRef.current[shipId];
      }
    });

    // Add ships for new players
    players.forEach(player => {
      if (player.id !== myPlayer?.id && !shipsRef.current[player.id]) {
        const playerPosition = (player.state as any)?.position || {
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
        };

        shipsRef.current[player.id] = createShipFromPlayer({
          id: player.id,
          position: playerPosition,
          color: player.color,
          hue: player.hue,
        });
      }
    });
  }, [players, myPlayer]);

  // Update other ships' positions when their player state changes
  useEffect(() => {
    players.forEach(player => {
      if (player.id !== myPlayer?.id && shipsRef.current[player.id]) {
        const playerPosition = (player.state as any)?.position;
        if (playerPosition) {
          const ship = shipsRef.current[player.id];
          ship.targetPosition = playerPosition;

          // Calculate direction for ship rotation
          const dx = playerPosition.x - ship.position.x;
          const dy = playerPosition.y - ship.position.y;
          if (dx !== 0 || dy !== 0) {
            ship.angle = Math.atan2(dy, dx);
          }
        }
      }
    });
  }, [players, myPlayer]);

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

  const createShipFromPlayer = (player: { id: string; position: Point; color?: string; hue?: string }): Ship => {
    const ship = createShip(player.position.x, player.position.y, 8, player.id);

    // Add color information from the server
    ship.color = player.color || "rgb(255, 255, 255)";
    ship.hue = player.hue || "rgb(200, 200, 200)";

    // Add target position for smooth movement
    ship.targetPosition = { ...ship.position };

    return ship;
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

  // Canvas setup and game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set initial canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Game loop
    const gameLoop = () => {
      if (!context) return;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw my ship
      if (myShipRef.current) {
        const updatedShip = updateShipPosition(myShipRef.current, mousePosition);
        myShipRef.current = updateShipPath(updatedShip);
        drawShip(context, myShipRef.current);
      }

      // Update and draw other ships
      Object.values(shipsRef.current).forEach((ship) => {
        const updatedShip = updateShipPosition(
          ship,
          ship.targetPosition,
          SHIP_SPEED * 0.8,
        );
        const finalShip = updateShipPath(updatedShip);
        shipsRef.current[ship.id!] = finalShip;
        drawShip(context, finalShip);
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    // Add event listeners
    window.addEventListener("resize", handleResize);

    // Start game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePosition]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      
      {/* Simple UI to show player count and ID */}
      <div className="absolute top-4 left-4 z-20 bg-black/80 p-4 rounded-lg text-white">
        <div className="text-sm">
          <div>Players: {players.length}</div>
          {myPlayer && (
            <div>Your ID: {myPlayer.id.substring(0, 8)}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;