"use client";

import { useState } from "react";
import usePartySocket from "partysocket/react";

import type { GameState, PlayerAction } from "@2up/game";

export const Game = ({ code }: { code: string }) => {
  const { gameState, dispatch } = useGameRoom(code);

  switch (gameState?.currentView) {
    case "lobby":
      return (
        <div className="space-y-5">
          <h1>Lobby</h1>
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
          <button onClick={() => dispatch({ type: "start" })}>Start</button>
        </div>
      );
    case "question":
      return (
        <div className="space-y-5">
          <h1>Question</h1>
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
          <button onClick={() => dispatch({ type: "submit" })}>Submit</button>
        </div>
      );
    case "results":
      return (
        <div className="space-y-5">
          <h1>Results</h1>
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
          <button onClick={() => dispatch({ type: "next" })}>Next</button>
        </div>
      );
    case "scoreboard":
      return (
        <div className="space-y-5">
          <h1>Scoreboard</h1>
          <pre>{JSON.stringify(gameState, null, 2)}</pre>
        </div>
      );
  }

  return null;
};

export const useGameRoom = (code: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_SERVER_URL ?? "127.0.0.1:1999",
    party: "game",
    room: code,
    query: {
      name: "kai",
    },
    onMessage: (event: MessageEvent<string>) => {
      const newGameState = JSON.parse(event.data) as GameState;
      setGameState(newGameState);
    },
  });

  const dispatch = (action: PlayerAction) => {
    socket.send(JSON.stringify(action));
  };

  return {
    gameState,
    dispatch,
  };
};
