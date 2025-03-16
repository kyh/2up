"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [bird, setBird] = useState<Bird>({ y: 200, velocity: 0, frame: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const birdSprites = useRef<HTMLImageElement[]>([]);
  const backgroundImage = useRef<HTMLImageElement | null>(null);
  const numberSprites = useRef<HTMLImageElement[]>([]);
  const gameOverImage = useRef<HTMLImageElement | null>(null);
  const messageImage = useRef<HTMLImageElement | null>(null);
  const pipeImage = useRef<HTMLImageElement | null>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  // Audio refs
  const pointSound = useRef<HTMLAudioElement | null>(null);
  const hitSound = useRef<HTMLAudioElement | null>(null);
  const wingSound = useRef<HTMLAudioElement | null>(null);

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
      setAssetsLoaded(true);
    });
  }, []);

  const playSound = useCallback(
    (sound: HTMLAudioElement | null) => {
      if (sound && !gameOver) {
        sound.currentTime = 0;
        sound
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
    },
    [gameOver],
  );

  const jump = useCallback(() => {
    if (!gameOver && gameStarted) {
      setBird((prevBird) => ({ ...prevBird, velocity: -JUMP_STRENGTH }));
      playSound(wingSound.current);
    } else if (!gameStarted) {
      setGameStarted(true);
    }
  }, [gameOver, gameStarted, playSound]);

  const restartGame = useCallback(() => {
    setBird({ y: 200, velocity: 0, frame: 0 });
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        if (!gameStarted) {
          setGameStarted(true);
        } else if (!gameOver) {
          jump();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [jump, gameStarted, gameOver]);

  useEffect(() => {
    if (!assetsLoaded) return;

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

      if (!gameStarted) {
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
      setBird((prevBird) => ({
        y: prevBird.y + prevBird.velocity,
        velocity: prevBird.velocity + GRAVITY,
        frame: (prevBird.frame + 1) % 3,
      }));

      // Move pipes
      setPipes((prevPipes) =>
        prevPipes.map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED })),
      );

      // Generate new pipes
      const lastPipe = pipes[pipes.length - 1];
      if (pipes.length === 0 || (lastPipe && lastPipe.x < canvas.width - 200)) {
        const topHeight = Math.random() * (canvas.height - PIPE_GAP - 100) + 50;
        setPipes((prevPipes) => [...prevPipes, { x: canvas.width, topHeight }]);
      }

      // Remove off-screen pipes
      setPipes((prevPipes) =>
        prevPipes.filter((pipe) => pipe.x + PIPE_WIDTH > 0),
      );

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
          setGameOver(true);
          playSound(hitSound.current);
        }

        if (
          birdRect.x < bottomPipeRect.x + bottomPipeRect.width &&
          birdRect.x + birdRect.width > bottomPipeRect.x &&
          birdRect.y < bottomPipeRect.y + bottomPipeRect.height &&
          birdRect.y + birdRect.height > bottomPipeRect.y
        ) {
          setGameOver(true);
          playSound(hitSound.current);
        }
      }

      // Update score
      if (
        !gameOver &&
        pipes.some(
          (pipe) => pipe.x + PIPE_WIDTH < 50 && pipe.x + PIPE_WIDTH >= 48,
        )
      ) {
        setScore((prevScore) => prevScore + 1);
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
      const scoreString = score.toString();
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
        setGameOver(true);
        playSound(hitSound.current);
      }

      if (gameOver) {
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
  }, [
    bird,
    pipes,
    gameOver,
    score,
    jump,
    gameStarted,
    assetsLoaded,
    restartGame,
    playSound,
  ]);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (gameOver) {
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
    },
    [gameOver, jump, restartGame],
  );

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial sizing

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onClick={handleCanvasClick}
    />
  );
};

export default FlappyBird;
