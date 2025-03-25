"use client";

import { useCallback, useEffect, useRef } from "react";

import { JumpDetection } from "./jump-detection";
import { useGameState } from "./use-game-state";

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { gameStateRef, loaded, jump, startGame, stopGame, restartGame } =
    useGameState();

  // Use useCallback to memoize the jump handler
  const handleJump = useCallback(
    (jumpStrength = 1) => {
      if (gameStateRef.current === "gameover") {
        restartGame();
        return;
      }
      jump(jumpStrength);
    },
    [jump, restartGame],
  );

  // Start game loop when assets are loaded and canvas is ready
  useEffect(() => {
    if (!loaded || !canvasRef.current) return;

    startGame({ canvas: canvasRef.current });

    // Clean up game loop when component unmounts
    return () => {
      stopGame();
    };
  }, [loaded, startGame, stopGame]);

  return (
    <>
      <JumpDetection onJump={handleJump} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={() => handleJump()}
      />
    </>
  );
};

export default App;
