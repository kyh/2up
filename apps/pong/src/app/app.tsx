"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  Circle,
  OrbitControls,
  PerspectiveCamera,
  Text,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { ThreeEvent } from "@react-three/fiber";

const Table = () => (
  <group>
    <lineSegments>
      <edgesGeometry args={[new THREE.BoxGeometry(10, 20, 0)]} />
      <lineBasicMaterial color="black" />
    </lineSegments>
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[10, 0.1]} />
      <meshBasicMaterial color="black" />
    </mesh>
  </group>
);

const Paddle = React.forwardRef<THREE.Group, React.ComponentProps<"group">>(
  (props, ref) => (
    <group {...props} ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.1, 16, 100]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </group>
  ),
);
Paddle.displayName = "Paddle";

const Ball = React.forwardRef<THREE.Mesh, React.ComponentProps<"mesh">>(
  (props, ref) => (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshBasicMaterial color="black" />
    </mesh>
  ),
);
Ball.displayName = "Ball";

const Game = () => {
  const playerPaddleRef = useRef<THREE.Group>(null!);
  const aiPaddleRef = useRef<THREE.Group>(null!);
  const ballRef = useRef<THREE.Mesh>(null!);
  const bounceCount = useRef(0);

  const [gameState, setGameState] = useState({
    playerScore: 0,
    aiScore: 0,
    gameStarted: false,
  });

  const ballVelocity = useRef(new THREE.Vector3(0, 0, 0));

  const resetGame = () => {
    if (ballRef.current) {
      ballRef.current.position.set(0, 0, 0);
    }
    const speed = 0.1;
    const angle = Math.random() * Math.PI * 2;
    ballVelocity.current.set(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      0,
    );
    setGameState((prev) => ({ ...prev, gameStarted: false }));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !gameState.gameStarted) {
        setGameState((prev) => ({ ...prev, gameStarted: true }));
        const speed = 0.1;
        const angle = -Math.PI / 2 + (Math.random() * 0.2 - 0.1);
        ballVelocity.current.set(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          0,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState.gameStarted]);

  useFrame(() => {
    if (
      !gameState.gameStarted ||
      !ballRef.current ||
      !playerPaddleRef.current ||
      !aiPaddleRef.current
    )
      return;

    // Ball physics
    const gravity = 0.004;
    const isBouncing =
      ballRef.current.position.z > 0 || ballVelocity.current.z !== 0;

    if (isBouncing) {
      ballVelocity.current.z -= gravity;
    }

    // Move ball
    ballRef.current.position.add(ballVelocity.current);
    const { x, y, z } = ballRef.current.position;

    // Floor bounce
    if (z < 0) {
      ballRef.current.position.z = 0;
      if (bounceCount.current < 1) {
        bounceCount.current++;
        ballVelocity.current.z *= -0.7; // 70% energy retention
      } else {
        ballVelocity.current.z = 0;
      }
    }

    // Side walls collision
    if (x >= 4.9 || x <= -4.9) {
      ballVelocity.current.x *= -1;
    }

    // Player paddle collision
    const playerPaddlePos = playerPaddleRef.current.position;
    if (
      y < playerPaddlePos.y + 0.5 &&
      y > playerPaddlePos.y - 0.5 &&
      x > playerPaddlePos.x - 0.7 &&
      x < playerPaddlePos.x + 0.7 &&
      ballVelocity.current.y < 0
    ) {
      const speed = ballVelocity.current.length();
      const angle = Math.atan2(y - playerPaddlePos.y, x - playerPaddlePos.x);
      ballVelocity.current.set(
        Math.cos(angle) * speed * 1.1,
        Math.abs(Math.sin(angle)) * speed * 1.1,
        0.15,
      );
      bounceCount.current = 0;
    }

    // AI paddle collision
    const aiPaddlePos = aiPaddleRef.current.position;
    if (
      y > aiPaddlePos.y - 0.5 &&
      y < aiPaddlePos.y + 0.5 &&
      x > aiPaddlePos.x - 0.7 &&
      x < aiPaddlePos.x + 0.7 &&
      ballVelocity.current.y > 0
    ) {
      const speed = ballVelocity.current.length();
      const angle = Math.atan2(y - aiPaddlePos.y, x - aiPaddlePos.x);
      ballVelocity.current.set(
        Math.cos(angle) * speed * 1.1,
        -Math.abs(Math.sin(angle)) * speed * 1.1,
        0.15,
      );
      bounceCount.current = 0;
    }

    // AI movement
    const aiSpeed = 0.08;
    if (ballRef.current.position.x > aiPaddleRef.current.position.x) {
      aiPaddleRef.current.position.x = Math.min(
        aiPaddleRef.current.position.x + aiSpeed,
        ballRef.current.position.x,
      );
    } else {
      aiPaddleRef.current.position.x = Math.max(
        aiPaddleRef.current.position.x - aiSpeed,
        ballRef.current.position.x,
      );
    }
    aiPaddleRef.current.position.x = THREE.MathUtils.clamp(
      aiPaddleRef.current.position.x,
      -4.5,
      4.5,
    );

    // Scoring
    if (y > 10) {
      setGameState((prev) => ({ ...prev, playerScore: prev.playerScore + 1 }));
      resetGame();
    } else if (y < -10) {
      setGameState((prev) => ({ ...prev, aiScore: prev.aiScore + 1 }));
      resetGame();
    }
  });

  const handleMouseMove = (event: ThreeEvent<PointerEvent>) => {
    if (playerPaddleRef.current) {
      const { x } = event.point;
      const clampedX = THREE.MathUtils.clamp(x, -4.5, 4.5);
      playerPaddleRef.current.position.x = clampedX;
      playerPaddleRef.current.position.y = -8;
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, -13, 12]} fov={50} />
      <OrbitControls enabled={false} target={[0, 0, 0]} />
      <ambientLight intensity={1} />
      <Table />
      <Ball ref={ballRef} />

      {ballRef.current && (
        <Circle
          args={[0.2, 16]}
          position={[
            ballRef.current.position.x,
            ballRef.current.position.y,
            -0.01,
          ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <meshBasicMaterial
            color="black"
            transparent
            opacity={0.3 - ballRef.current.position.z * 0.2}
          />
        </Circle>
      )}

      <Paddle ref={aiPaddleRef} position={[0, 8, 0]} />

      <Paddle ref={playerPaddleRef} position={[0, -8, 0]} />

      <mesh onPointerMove={handleMouseMove} visible={false}>
        <planeGeometry args={[100, 100]} />
      </mesh>

      <Text position={[-4, 10.5, 0]} fontSize={0.5} color="black">
        Player: {gameState.playerScore}
      </Text>
      <Text position={[4, 10.5, 0]} fontSize={0.5} color="black">
        AI: {gameState.aiScore}
      </Text>

      {!gameState.gameStarted && (
        <Text position={[0, 0, 1]} fontSize={0.5} color="black">
          Press Space to Start
        </Text>
      )}
    </>
  );
};

const Pong = () => {
  return (
    <div className="h-dvh w-dvw" style={{ backgroundColor: "#cccccc" }}>
      <Canvas>
        <Suspense fallback={null}>
          <Game />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Pong;
