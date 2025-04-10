"use client";

import { useCallback, useEffect, useRef } from "react";

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
];

const getRandomShape = () => {
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  return shape;
};

const rotateShape = (shape: number[][]): number[][] => {
  return shape[0].map((_, colIndex) =>
    shape.map((row) => row[colIndex]).reverse(),
  );
};

export const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<number[][]>([]);
  const shapeRef = useRef(getRandomShape());
  const positionRef = useRef({ x: 0, y: 0 });
  const canvasWidth = useRef(window.innerWidth);
  const canvasHeight = useRef(window.innerHeight);
  const cols = useRef(Math.floor(canvasWidth.current / blockSize));
  const rows = useRef(Math.floor(canvasHeight.current / blockSize));

  const initializeGrid = useCallback(() => {
    gridRef.current = Array.from({ length: rows.current }, () =>
      Array(cols.current).fill(0),
    );
  }, []);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth.current, canvasHeight.current);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth.current, canvasHeight.current);

    for (let r = 0; r < rows.current; r++) {
      for (let c = 0; c < cols.current; c++) {
        if (gridRef.current[r][c]) {
          ctx.fillStyle = "#fff";
          ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
        }
      }
    }
  }, []);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D) => {
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
        shapeRef.current = getRandomShape();
        positionRef.current = { x: Math.floor(cols.current / 2) - 1, y: 0 };
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
      } else if (e.key === "Space") {
        const rotatedShape = rotateShape(shapeRef.current);
        if (
          positionRef.current.x + rotatedShape[0].length <= cols.current &&
          !rotatedShape.some((row, r) =>
            row.some(
              (cell, c) =>
                cell &&
                gridRef.current[positionRef.current.y + r]?.[
                  positionRef.current.x + c
                ],
            ),
          )
        ) {
          shapeRef.current = rotatedShape;
        }
      }
    },
    [moveShape],
  );

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  useEffect(() => {
    const interval = setInterval(() => {
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
        shapeRef.current = getRandomShape();
        positionRef.current = { x: Math.floor(cols.current / 2) - 1, y: 0 };
      }

      // Redraw the canvas
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        drawGrid(ctx);
        drawShape(ctx);
      }
    }, 500); // Adjust the interval time as needed

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, [drawGrid, drawShape, mergeShapeToGrid, clearRows]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      drawGrid(ctx);
      drawShape(ctx);
    }
  }, [drawGrid, drawShape]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth.current}
      height={canvasHeight.current}
    />
  );
};

export default App;
