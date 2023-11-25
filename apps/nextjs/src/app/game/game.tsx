"use client";

import { useState } from "react";
import Link from "next/link";
import usePartySocket from "partysocket/react";

import type { GameState, PlayerAction } from "@2up/game";

export const Game = ({ code }: { code: string }) => {
  const { gameState, dispatch } = useGameRoom(code);

  if (!gameState) {
    return <div>Loading...</div>;
  }

  const currentScene = gameState.scenes[gameState.currentSceneIndex];

  switch (gameState?.currentView) {
    case "lobby":
      return (
        <div className="space-y-5">
          <h1>Lobby</h1>
          <pre>{JSON.stringify(gameState.players, null, 2)}</pre>
          <button onClick={() => dispatch({ type: "start" })}>Start</button>
        </div>
      );
    case "question":
      return (
        <div className="space-y-5">
          <h1>Question</h1>
          <pre>{currentScene?.question}</pre>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              dispatch({ type: "submit", payload: formData.get("answer") });
            }}
          >
            <input id="answer" name="answer" type="text" />
            <button type="submit">Submit</button>
          </form>
        </div>
      );
    case "results":
      return (
        <div className="space-y-5">
          <h1>Results</h1>
          <pre>{JSON.stringify(gameState.playerSubmissions, null, 2)}</pre>
          <button onClick={() => dispatch({ type: "next" })}>Next</button>
        </div>
      );
    case "scoreboard":
      return (
        <div className="space-y-5">
          <h1>Scoreboard</h1>
          <pre>{JSON.stringify(gameState.players, null, 2)}</pre>
          <button onClick={() => dispatch({ type: "next" })}>Next</button>
        </div>
      );
    case "leaderboard":
      return (
        <div className="space-y-5">
          <h1>Leaderboard</h1>
          <pre>{JSON.stringify(gameState.players, null, 2)}</pre>
          <Link href="/">End Game</Link>
        </div>
      );
  }
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
