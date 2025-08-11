"use client";

import { useEffect, useRef, useState } from "react";
import {
  usePlayroomRoot,
  useMultiplayerState,
  usePlayersList,
  usePlayerState,
  useIsHost,
  useMyPlayer,
} from "@repo/multiplayer";

import { Background } from "@/app/(home)/_components/background";

const HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8787"
    : "https://vg-partyserver.kyh.workers.dev";
const PARTY = "vg-server";
const ROOM = "playroom-demo";

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

  return <PlayroomDemo />;
};

type Point = {
  x: number;
  y: number;
};

const PlayroomDemo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });

  // Use PlayroomKit-style hooks
  const [gameTitle, setGameTitle] = useMultiplayerState("title", "Multiplayer Demo");
  const [playerCount, setPlayerCount] = useMultiplayerState("playerCount", 0);
  const players = usePlayersList(true);
  const myPlayer = useMyPlayer();
  const isHost = useIsHost();

  // Use player state for position
  const [myPosition, setMyPosition] = usePlayerState(
    myPlayer,
    "position",
    { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400, 
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300 }
  );

  // Update player count when players change
  useEffect(() => {
    setPlayerCount(players.length);
  }, [players.length, setPlayerCount]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePosition(newPos);
      setMyPosition(newPos);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [setMyPosition]);

  // Canvas setup and drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawPlayer = (player: any, position: Point, isMe: boolean) => {
      if (!context || !position) return;

      const radius = isMe ? 12 : 8;
      
      // Draw player circle
      context.beginPath();
      context.arc(position.x, position.y, radius, 0, Math.PI * 2);
      context.fillStyle = player.color || "#ffffff";
      context.fill();
      
      // Draw border
      context.strokeStyle = isMe ? "#ffff00" : player.color || "#ffffff";
      context.lineWidth = 2;
      context.stroke();

      // Draw player ID
      context.fillStyle = "#ffffff";
      context.font = "12px monospace";
      context.textAlign = "center";
      context.fillText(
        isMe ? "You" : player.id.substring(0, 6),
        position.x,
        position.y - radius - 5
      );

      // Draw host indicator
      if (player.isHost) {
        context.fillStyle = "#ffd700";
        context.font = "10px monospace";
        context.fillText("HOST", position.x, position.y + radius + 15);
      }
    };

    const gameLoop = () => {
      if (!context) return;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all players
      players.forEach((player) => {
        const position = (player.state as any)?.position;
        const isMe = player.id === myPlayer?.id;
        drawPlayer(player, position, isMe);
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener("resize", handleResize);
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [players, myPlayer]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-black/80 p-4 rounded-lg text-white">
        <h1 className="text-xl font-bold mb-2">PlayroomKit Demo</h1>
        
        {/* Game Title (editable by host) */}
        <div className="mb-3">
          {isHost ? (
            <input
              type="text"
              value={gameTitle}
              onChange={(e) => setGameTitle(e.target.value)}
              className="bg-white/20 px-2 py-1 rounded text-sm w-48"
              placeholder="Game title..."
            />
          ) : (
            <div className="text-lg">{gameTitle}</div>
          )}
        </div>

        {/* Player Info */}
        <div className="space-y-1 text-sm">
          <div>Players: {playerCount}</div>
          <div>You are: {isHost ? "Host" : "Player"}</div>
          {myPlayer && (
            <div>Your ID: {myPlayer.id.substring(0, 8)}</div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4 text-xs text-gray-300">
          <div>• Move your mouse to control your cursor</div>
          {isHost && <div>• You can edit the game title as host</div>}
        </div>
      </div>

      {/* Players List */}
      <div className="absolute top-4 right-4 z-20 bg-black/80 p-4 rounded-lg text-white">
        <h3 className="font-bold mb-2">Players ({players.length})</h3>
        <div className="space-y-1 text-sm max-h-60 overflow-y-auto">
          {players.map((player) => (
            <PlayerItem key={player.id} player={player} />
          ))}
        </div>
      </div>
    </>
  );
};

// Component to demonstrate usePlayerState
const PlayerItem = ({ player }: { player: any }) => {
  const [playerScore, setPlayerScore] = usePlayerState(player, "score", 0);
  const myPlayer = useMyPlayer();
  const isMe = player.id === myPlayer?.id;

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: player.color }} 
        />
        <span className={isMe ? "font-bold" : ""}>
          {isMe ? "You" : player.id.substring(0, 8)}
        </span>
        {player.isHost && (
          <span className="text-yellow-400 text-xs">HOST</span>
        )}
      </div>
      
      <div className="flex items-center space-x-1">
        {isMe && (
          <button
            onClick={() => setPlayerScore(playerScore + 1)}
            className="text-xs bg-blue-500 px-1 py-0.5 rounded hover:bg-blue-400"
          >
            +
          </button>
        )}
        <span className="text-xs">{playerScore}</span>
      </div>
    </div>
  );
};

export default Page;