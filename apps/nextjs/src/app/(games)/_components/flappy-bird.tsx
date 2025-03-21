"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { JumpDetection } from "./jump-detection";

const GRAVITY = 0.5;
const JUMP_STRENGTH = 10;
const PIPE_WIDTH = 52;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;

type Bird = {
  y: number;
  velocity: number;
  frame: number;
};

type Pipe = {
  x: number;
  topHeight: number;
};

export const FlappyBird = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert state to refs
  const birdRef = useRef<Bird>({ y: 200, velocity: 0, frame: 0 });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef<number>(0);
  const gameOverRef = useRef<boolean>(false);
  const gameStartedRef = useRef<boolean>(false);
  const assetsLoadedRef = useRef<boolean>(false);

  // Force render when assets are loaded
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const birdSprites = useRef<HTMLImageElement[]>([]);
  const backgroundImage = useRef<HTMLImageElement | null>(null);
  const numberSprites = useRef<HTMLImageElement[]>([]);
  const gameOverImage = useRef<HTMLImageElement | null>(null);
  const messageImage = useRef<HTMLImageElement | null>(null);
  const pipeImage = useRef<HTMLImageElement | null>(null);

  // Audio refs
  const pointSound = useRef<HTMLAudioElement | null>(null);
  const hitSound = useRef<HTMLAudioElement | null>(null);
  const wingSound = useRef<HTMLAudioElement | null>(null);

  const playSound = (sound: HTMLAudioElement | null) => {
    if (sound && !gameOverRef.current) {
      sound.currentTime = 0;
      sound
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
  };

  const jump = () => {
    console.log("jump", gameOverRef.current, gameStartedRef.current);
    if (!gameOverRef.current && gameStartedRef.current) {
      birdRef.current.velocity = -JUMP_STRENGTH;
      playSound(wingSound.current);
    } else if (!gameStartedRef.current) {
      gameStartedRef.current = true;
    }
  };

  const restartGame = () => {
    birdRef.current = { y: 200, velocity: 0, frame: 0 };
    pipesRef.current = [];
    scoreRef.current = 0;
    gameOverRef.current = false;
    gameStartedRef.current = true;
    // Force a re-render
    setAssetsLoaded(!assetsLoaded);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (gameOverRef.current) {
      console.log("here?", x, y);
      // Check if click is within Restart button area
      if (
        x >= canvas.width / 2 - 50 &&
        x <= canvas.width / 2 + 50 &&
        y >= canvas.height / 2 + 50 &&
        y <= canvas.height / 2 + 90
      ) {
        restartGame();
      }
    } else {
      jump();
    }
  };

  useEffect(() => {
    const birdUrls = [
      "/flappy-bird/yellowbird-downflap.png",
      "/flappy-bird/yellowbird-midflap.png",
      "/flappy-bird/yellowbird-upflap.png",
    ];
    const numberUrls = [
      "/flappy-bird/0.png",
      "/flappy-bird/1.png",
      "/flappy-bird/2.png",
      "/flappy-bird/3.png",
      "/flappy-bird/4.png",
      "/flappy-bird/5.png",
      "/flappy-bird/6.png",
      "/flappy-bird/7.png",
      "/flappy-bird/8.png",
      "/flappy-bird/9.png",
    ];
    const backgroundUrl = "/flappy-bird/background-day.png";
    const gameOverUrl = "/flappy-bird/gameover.png";
    const messageUrl = "/flappy-bird/message.png";
    const pipeUrl = "/flappy-bird/pipe-green.png";

    const loadImage = (url: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

    const loadAudio = (url: string) =>
      new Promise<HTMLAudioElement>((resolve, reject) => {
        const audio = new Audio(url);
        audio.oncanplaythrough = () => resolve(audio);
        audio.onerror = reject;
        audio.src = url;
      });

    void Promise.all([
      ...birdUrls.map(loadImage),
      ...numberUrls.map(loadImage),
      loadImage(backgroundUrl),
      loadImage(gameOverUrl),
      loadImage(messageUrl),
      loadImage(pipeUrl),
      loadAudio("/flappy-bird/point.wav"),
      loadAudio("/flappy-bird/hit.wav"),
      loadAudio("/flappy-bird/wing.wav"),
    ]).then((loadedAssets) => {
      birdSprites.current = loadedAssets.slice(0, 3) as HTMLImageElement[];
      numberSprites.current = loadedAssets.slice(3, 13) as HTMLImageElement[];
      backgroundImage.current = loadedAssets[13] as HTMLImageElement;
      gameOverImage.current = loadedAssets[14] as HTMLImageElement;
      messageImage.current = loadedAssets[15] as HTMLImageElement;
      pipeImage.current = loadedAssets[16] as HTMLImageElement;
      pointSound.current = loadedAssets[17] as HTMLAudioElement;
      hitSound.current = loadedAssets[18] as HTMLAudioElement;
      wingSound.current = loadedAssets[19] as HTMLAudioElement;
      assetsLoadedRef.current = true;
      setAssetsLoaded(true); // We still need this to trigger a render
    });
  }, []);

  useEffect(() => {
    if (!assetsLoadedRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const gameLoop = setInterval(() => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      if (backgroundImage.current) {
        ctx.drawImage(
          backgroundImage.current,
          0,
          0,
          canvas.width,
          canvas.height,
        );
      }

      if (!gameStartedRef.current) {
        // Draw message
        if (messageImage.current) {
          const messageWidth = 184;
          const messageHeight = 267;
          const messageX = (canvas.width - messageWidth) / 2;
          const messageY = (canvas.height - messageHeight) / 2;
          ctx.drawImage(
            messageImage.current,
            messageX,
            messageY,
            messageWidth,
            messageHeight,
          );
        }
        return;
      }

      // Update bird position and animation frame
      const bird = birdRef.current;
      bird.y += bird.velocity;
      bird.velocity += GRAVITY;
      bird.frame = (bird.frame + 1) % 3;

      // Move pipes
      const pipes = pipesRef.current;
      pipes.forEach((pipe) => (pipe.x -= PIPE_SPEED));

      // Generate new pipes
      const lastPipe = pipes[pipes.length - 1];
      if (pipes.length === 0 || (lastPipe && lastPipe.x < canvas.width - 200)) {
        const topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
        pipes.push({ x: canvas.width, topHeight });
      }

      // Remove off-screen pipes
      pipesRef.current = pipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0);

      // Check collisions
      const birdRect = {
        x: 50,
        y: bird.y,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT,
      };

      for (const pipe of pipes) {
        const topPipeRect = {
          x: pipe.x,
          y: 0,
          width: PIPE_WIDTH,
          height: pipe.topHeight,
        };
        const bottomPipeRect = {
          x: pipe.x,
          y: pipe.topHeight + PIPE_GAP,
          width: PIPE_WIDTH,
          height: canvas.height - pipe.topHeight - PIPE_GAP,
        };

        if (
          birdRect.x < topPipeRect.x + topPipeRect.width &&
          birdRect.x + birdRect.width > topPipeRect.x &&
          birdRect.y < topPipeRect.y + topPipeRect.height &&
          birdRect.y + birdRect.height > topPipeRect.y
        ) {
          gameOverRef.current = true;
          playSound(hitSound.current);
        }

        if (
          birdRect.x < bottomPipeRect.x + bottomPipeRect.width &&
          birdRect.x + birdRect.width > bottomPipeRect.x &&
          birdRect.y < bottomPipeRect.y + bottomPipeRect.height &&
          birdRect.y + birdRect.height > bottomPipeRect.y
        ) {
          gameOverRef.current = true;
          playSound(hitSound.current);
        }
      }

      // Update score
      if (
        !gameOverRef.current &&
        pipes.some(
          (pipe) => pipe.x + PIPE_WIDTH < 50 && pipe.x + PIPE_WIDTH >= 48,
        )
      ) {
        scoreRef.current += 1;
        playSound(pointSound.current);
      }

      // Draw pipes
      pipes.forEach((pipe) => {
        if (pipeImage.current) {
          // Draw top pipe (flipped vertically)
          ctx.save();
          ctx.scale(1, -1);
          ctx.drawImage(
            pipeImage.current,
            pipe.x,
            -pipe.topHeight,
            PIPE_WIDTH,
            640,
          );
          ctx.restore();

          // Draw bottom pipe
          ctx.drawImage(
            pipeImage.current,
            pipe.x,
            pipe.topHeight + PIPE_GAP,
            PIPE_WIDTH,
            640,
          );
        }
      });

      // Draw bird
      ctx.save();
      ctx.translate(50 + BIRD_WIDTH / 2, bird.y + BIRD_HEIGHT / 2);
      ctx.rotate(
        Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.1)),
      );
      const sprite = birdSprites.current[bird.frame];
      if (sprite) {
        ctx.drawImage(
          sprite,
          -BIRD_WIDTH / 2,
          -BIRD_HEIGHT / 2,
          BIRD_WIDTH,
          BIRD_HEIGHT,
        );
      }
      ctx.restore();

      // Draw score
      const scoreString = scoreRef.current.toString();
      const digitWidth = 24;
      const totalWidth = scoreString.length * digitWidth;
      const startX = (canvas.width - totalWidth) / 2;
      scoreString.split("").forEach((digit, index) => {
        const digitImage = numberSprites.current[Number.parseInt(digit)];
        if (digitImage) {
          ctx.drawImage(
            digitImage,
            startX + index * digitWidth,
            20,
            digitWidth,
            36,
          );
        }
      });

      if (bird.y > canvas.height || bird.y < 0) {
        gameOverRef.current = true;
        playSound(hitSound.current);
      }

      if (gameOverRef.current) {
        clearInterval(gameLoop);
        if (gameOverImage.current) {
          const gameOverWidth = 192;
          const gameOverHeight = 42;
          const gameOverX = (canvas.width - gameOverWidth) / 2;
          const gameOverY = (canvas.height - gameOverHeight) / 2;
          ctx.drawImage(
            gameOverImage.current,
            gameOverX,
            gameOverY,
            gameOverWidth,
            gameOverHeight,
          );

          // Draw Restart button
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
          ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 + 50, 100, 40);
          ctx.fillStyle = "white";
          ctx.font = "20px Arial";
          ctx.fillText(
            "Restart",
            canvas.width / 2 - 30,
            canvas.height / 2 + 75,
          );
        }
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [assetsLoaded]);

  return (
    <>
      <JumpDetection onJump={jump} />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleCanvasClick}
      />
    </>
  );
};

export default FlappyBird;
