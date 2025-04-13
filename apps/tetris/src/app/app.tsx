"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type * as poseDetection from "@tensorflow-models/pose-detection";
import { Camera } from "./camera";

const blockSize = 30;
const shapes = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
  [
    [1, 1, 1],
    [1, 0, 0],
  ], // L
  [
    [1, 1, 1],
    [0, 0, 1],
  ], // J
] as const;

const getRandomShape = (): number[][] => {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex].map((row) => [...row]);
};

const rotateShape = (shape: number[][]): number[][] => {
  // Transpose the matrix
  const transposed = shape[0].map((_, colIndex) =>
    shape.map((row) => row[colIndex]),
  );
  // Reverse each row to rotate clockwise
  return transposed.map((row) => row.reverse());
};

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<number[][]>([]);
  const shapeRef = useRef(getRandomShape());
  const nextShapeRef = useRef(getRandomShape());
  const positionRef = useRef({ x: 0, y: 0 });
  const canvasWidth = useRef(Math.min(700, window.innerWidth));
  const canvasHeight = useRef(window.innerHeight);
  const cols = useRef(Math.floor(canvasWidth.current / blockSize));
  const rows = useRef(Math.floor(canvasHeight.current / blockSize));
  const lastUpdateTime = useRef(0);
  const gameLoopRef = useRef<number>(0);
  const lastShoulderPositions = useRef<{
    left: { x: number; y: number };
    right: { x: number; y: number };
  } | null>(null);
  const lastRotationTime = useRef(0);
  const [showSpinIndicator, setShowSpinIndicator] = useState(false);

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, canvasWidth.current, canvasHeight.current);

      // Draw grid lines
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      for (let r = 0; r < rows.current; r++) {
        for (let c = 0; c < cols.current; c++) {
          ctx.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
          if (gridRef.current[r][c]) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
          }
        }
      }

      // Draw spin indicator if active
      if (showSpinIndicator) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.5)";
        ctx.fillRect(0, 0, canvasWidth.current, canvasHeight.current);
      }
    },
    [showSpinIndicator],
  );

  const drawShape = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw current shape
    ctx.fillStyle = "#f00";
    shapeRef.current.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.fillRect(
            (positionRef.current.x + c) * blockSize,
            (positionRef.current.y + r) * blockSize,
            blockSize,
            blockSize,
          );
        }
      });
    });

    // Draw next shape preview
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    // Ensure the preview stays within bounds
    const previewX = Math.max(
      0,
      Math.min(
        positionRef.current.x,
        cols.current - nextShapeRef.current[0].length,
      ),
    );
    const previewY = 0; // Top of the canvas
    nextShapeRef.current.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          ctx.fillRect(
            (previewX + c) * blockSize,
            (previewY + r) * blockSize,
            blockSize,
            blockSize,
          );
        }
      });
    });
  }, []);

  const mergeShapeToGrid = useCallback(() => {
    shapeRef.current.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const x = positionRef.current.x + c;
          const y = positionRef.current.y + r;
          if (y < rows.current && x >= 0 && x < cols.current) {
            gridRef.current[y][x] = cell;
          }
        }
      });
    });
  }, []);

  const clearRows = useCallback(() => {
    gridRef.current = gridRef.current.filter((row) =>
      row.some((cell) => cell === 0),
    );
    while (gridRef.current.length < rows.current) {
      gridRef.current.unshift(Array(cols.current).fill(0));
    }
  }, []);

  const moveShape = useCallback(
    (dx: number, dy: number) => {
      const newX = positionRef.current.x + dx;
      const newY = positionRef.current.y + dy;

      if (
        newX >= 0 &&
        newX + shapeRef.current[0].length <= cols.current &&
        newY + shapeRef.current.length <= rows.current &&
        !shapeRef.current.some((row, r) =>
          row.some((cell, c) => cell && gridRef.current[newY + r]?.[newX + c]),
        )
      ) {
        positionRef.current = { x: newX, y: newY };
      } else if (dy > 0) {
        mergeShapeToGrid();
        clearRows();
        // Set current shape to next shape and generate new next shape
        shapeRef.current = nextShapeRef.current;
        nextShapeRef.current = getRandomShape();
        // Keep the same x position for the new shape, but ensure it's within bounds
        positionRef.current = {
          x: Math.max(
            0,
            Math.min(
              positionRef.current.x,
              cols.current - shapeRef.current[0].length,
            ),
          ),
          y: 0,
        };
      }
    },
    [clearRows, mergeShapeToGrid],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        moveShape(-1, 0);
      } else if (e.key === "ArrowRight") {
        moveShape(1, 0);
      } else if (e.key === " ") {
        const rotatedShape = rotateShape(shapeRef.current);
        const newX = positionRef.current.x;
        const newY = positionRef.current.y;

        // Check if the rotated shape would be within bounds
        const wouldFit =
          newX >= 0 &&
          newX + rotatedShape[0].length <= cols.current &&
          newY + rotatedShape.length <= rows.current &&
          !rotatedShape.some((row, r) =>
            row.some(
              (cell, c) => cell && gridRef.current[newY + r]?.[newX + c],
            ),
          );

        if (wouldFit) {
          shapeRef.current = rotatedShape;
        }
      } else if (e.key === "ArrowDown") {
        moveShape(0, 1);
      }
    },
    [moveShape],
  );

  const handlePoseDetected = useCallback((pose: poseDetection.Pose) => {
    // Get all relevant keypoints (only upper body)
    const keypoints = {
      leftWrist: pose.keypoints.find((kp) => kp.name === "left_wrist"),
      rightWrist: pose.keypoints.find((kp) => kp.name === "right_wrist"),
      leftElbow: pose.keypoints.find((kp) => kp.name === "left_elbow"),
      rightElbow: pose.keypoints.find((kp) => kp.name === "right_elbow"),
      leftShoulder: pose.keypoints.find((kp) => kp.name === "left_shoulder"),
      rightShoulder: pose.keypoints.find((kp) => kp.name === "right_shoulder"),
      nose: pose.keypoints.find((kp) => kp.name === "nose"),
    };

    // Type assertion since we've checked all keypoints exist
    const kp = keypoints as {
      [K in keyof typeof keypoints]: poseDetection.Keypoint;
    };

    // Check for rotation by measuring distance between shoulders
    const shoulderDistance = Math.abs(kp.leftShoulder.x - kp.rightShoulder.x);
    const isRotating =
      shoulderDistance < 100 && Date.now() - lastRotationTime.current > 600;

    if (isRotating) {
      console.log("Spin detected! Shoulder distance:", shoulderDistance);

      const rotatedShape = rotateShape(shapeRef.current);
      const newX = positionRef.current.x;
      const newY = positionRef.current.y;

      // Check if the rotated shape would be within bounds
      const wouldFit =
        newX >= 0 &&
        newX + rotatedShape[0].length <= cols.current &&
        newY + rotatedShape.length <= rows.current &&
        !rotatedShape.some((row, r) =>
          row.some((cell, c) => cell && gridRef.current[newY + r]?.[newX + c]),
        );

      if (wouldFit) {
        shapeRef.current = rotatedShape;
        lastRotationTime.current = Date.now();
        console.log("Shape rotated successfully!");
      }
    }

    // Update block position based on nose position
    if (kp.nose) {
      // Convert nose x position to grid position and invert it
      const noseXPercent = 1 - kp.nose.x / canvasWidth.current;
      const targetX = Math.floor(noseXPercent * cols.current);

      // Ensure the shape stays within bounds
      const maxX = cols.current - shapeRef.current[0].length;
      const newX = Math.max(0, Math.min(targetX, maxX));

      // Only update position if it's different to avoid unnecessary moves
      if (newX !== positionRef.current.x) {
        positionRef.current.x = newX;
      }
    }

    // Calculate angles and positions with less sensitive thresholds
    // I shape: Both arms straight up
    const isStandingUpright =
      kp.leftWrist.y < kp.leftShoulder.y - 150 && // Left arm raised high
      kp.rightWrist.y < kp.rightShoulder.y - 150 && // Right arm raised high
      Math.abs(kp.leftWrist.x - kp.leftShoulder.x) < 30 && // Arms not extended
      Math.abs(kp.rightWrist.x - kp.rightShoulder.x) < 30;

    // O shape: Hands between torso
    const isMakingCircle =
      kp.leftWrist.x > kp.leftShoulder.x && // Left hand to the right of left shoulder
      kp.leftWrist.x < kp.rightShoulder.x && // Left hand to the left of right shoulder
      kp.rightWrist.x > kp.leftShoulder.x && // Right hand to the right of left shoulder
      kp.rightWrist.x < kp.rightShoulder.x && // Right hand to the left of right shoulder
      Math.abs(kp.leftWrist.y - kp.rightWrist.y) < 100 && // Hands at similar height
      Math.abs(kp.leftWrist.x - kp.rightWrist.x) < 100; // Hands close together

    // T shape: Extend arms straight out to sides
    const isTShape =
      Math.abs(kp.leftWrist.y - kp.rightWrist.y) < 100 && // Arms level
      Math.abs(kp.leftElbow.y - kp.rightElbow.y) < 100 &&
      Math.abs(kp.leftWrist.x - kp.leftShoulder.x) > 150 && // Arms extended
      Math.abs(kp.rightWrist.x - kp.rightShoulder.x) > 150;

    // S shape: Left arm up and right arm out
    const isSShape =
      kp.leftWrist.y < kp.leftShoulder.y - 100 && // Left arm raised
      Math.abs(kp.rightWrist.x - kp.rightShoulder.x) > 150 && // Right arm extended
      kp.rightWrist.y > kp.rightShoulder.y && // Right arm not raised
      Math.abs(kp.leftWrist.x - kp.leftShoulder.x) < 50; // Left arm not extended

    // Z shape: Right arm up and left arm out
    const isZShape =
      kp.rightWrist.y < kp.rightShoulder.y - 100 && // Right arm raised
      Math.abs(kp.leftWrist.x - kp.leftShoulder.x) > 150 && // Left arm extended
      kp.leftWrist.y > kp.leftShoulder.y && // Left arm not raised
      Math.abs(kp.rightWrist.x - kp.rightShoulder.x) < 50; // Right arm not extended

    // L shape: Left arm up, right arm down
    const isLShape =
      kp.leftWrist.y < kp.leftShoulder.y - 150 && // Left arm raised high
      kp.rightWrist.y > kp.rightShoulder.y + 50 && // Right arm below shoulder
      Math.abs(kp.rightWrist.x - kp.rightShoulder.x) < 30 && // Right arm at side
      Math.abs(kp.leftWrist.x - kp.leftShoulder.x) < 30; // Left arm at side

    // J shape: Right arm up, left arm down
    const isJShape =
      kp.rightWrist.y < kp.rightShoulder.y - 150 && // Right arm raised high
      kp.leftWrist.y > kp.leftShoulder.y + 50 && // Left arm below shoulder
      Math.abs(kp.leftWrist.x - kp.leftShoulder.x) < 30 && // Left arm at side
      Math.abs(kp.rightWrist.x - kp.rightShoulder.x) < 30; // Right arm at side

    // Determine shape based on pose
    if (isStandingUpright) {
      shapeRef.current = shapes[0].map((row) => [...row]); // I shape
    } else if (isMakingCircle) {
      shapeRef.current = shapes[1].map((row) => [...row]); // O shape
    } else if (isTShape) {
      shapeRef.current = shapes[2].map((row) => [...row]); // T shape
    } else if (isSShape) {
      shapeRef.current = shapes[3].map((row) => [...row]); // S shape
    } else if (isZShape) {
      shapeRef.current = shapes[4].map((row) => [...row]); // Z shape
    } else if (isLShape) {
      shapeRef.current = shapes[5].map((row) => [...row]); // L shape
    } else if (isJShape) {
      shapeRef.current = shapes[6].map((row) => [...row]); // J shape
    }
  }, []);

  const resetGame = useCallback(() => {
    // Clear the grid
    gridRef.current = Array.from({ length: rows.current }, () =>
      Array(cols.current).fill(0),
    );
    // Reset position and shapes
    positionRef.current = { x: Math.floor(cols.current / 2) - 1, y: 0 };
    shapeRef.current = getRandomShape();
    nextShapeRef.current = getRandomShape();
  }, []);

  // Initialize grid and starting position
  useEffect(() => {
    gridRef.current = Array.from({ length: rows.current }, () =>
      Array(cols.current).fill(0),
    );
    positionRef.current = { x: Math.floor(cols.current / 2) - 1, y: 0 };
  }, []);

  // Game loop using requestAnimationFrame
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp;
      }

      const deltaTime = timestamp - lastUpdateTime.current;

      // Update game state every 500ms
      if (deltaTime >= 500) {
        // Move the shape down by 1 unit
        positionRef.current.y += 1;

        // Check for collisions or if the shape has reached the bottom
        const newY = positionRef.current.y;
        if (
          newY + shapeRef.current.length > rows.current ||
          shapeRef.current.some((row, r) =>
            row.some(
              (cell, c) =>
                cell && gridRef.current[newY + r]?.[positionRef.current.x + c],
            ),
          )
        ) {
          // Merge the shape into the grid and reset position
          positionRef.current.y -= 1; // Undo the last move
          mergeShapeToGrid();
          clearRows();

          // Check if any block has reached the top
          const hasBlockAtTop = gridRef.current[0].some((cell) => cell === 1);
          if (hasBlockAtTop) {
            resetGame();
          } else {
            // Set current shape to next shape and generate new next shape
            shapeRef.current = nextShapeRef.current;
            nextShapeRef.current = getRandomShape();
            positionRef.current = { x: Math.floor(cols.current / 2) - 1, y: 0 };
          }
        }

        lastUpdateTime.current = timestamp;
      }

      // Always redraw the canvas
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        drawGrid(ctx);
        drawShape(ctx);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    },
    [drawGrid, drawShape, mergeShapeToGrid, clearRows, resetGame],
  );

  // Start game loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop]);

  // Handle keyboard input
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <main className="flex">
      <canvas
        className="m-auto"
        ref={canvasRef}
        width={canvasWidth.current}
        height={canvasHeight.current}
      />
      <Camera onPoseDetected={handlePoseDetected} />
    </main>
  );
};

export default App;
