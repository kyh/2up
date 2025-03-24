"use client";

import type { Group, Side } from "three";
import { useEffect, useRef, useState } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

// Type definitions
type CellType = 0 | 1 | 2 | 3; // 0 = empty, 1 = wall, 2 = pellet, 3 = power pellet
type GameMap = CellType[][];
type Direction = Vector3;
type GhostId = number;

type PelletData = {
  id: string;
  position: Vector3;
  isPowerPellet: boolean;
  collected: boolean;
};

type GhostData = {
  id: GhostId;
  position: Vector3;
  color: string;
  direction: Direction;
};

// Game map layout: 0 = empty, 1 = wall, 2 = pellet, 3 = power pellet
const MAP: GameMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Direction constants
const DIRECTIONS = {
  UP: new Vector3(0, 0, -1),
  DOWN: new Vector3(0, 0, 1),
  LEFT: new Vector3(-1, 0, 0),
  RIGHT: new Vector3(1, 0, 0),
  NONE: new Vector3(0, 0, 0),
};

type WallProps = {
  position: [number, number, number];
};

// Wall component with transparency
const Wall = ({ position }: WallProps) => {
  return (
    <mesh
      position={[position[0], position[1] + 0.5, position[2]]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.95, 1, 0.95]} />{" "}
      {/* Slightly smaller visually to prevent clipping */}
      <meshStandardMaterial color="#1d4ed8" transparent opacity={0.7} />{" "}
      {/* Added transparency */}
    </mesh>
  );
};

type PelletProps = {
  position: Vector3;
  isPowerPellet?: boolean;
  onCollect?: () => void;
};

const Pellet = ({
  position,
  isPowerPellet = false,
  onCollect,
}: PelletProps) => {
  const ref = useRef<Group>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      userData={{ type: isPowerPellet ? "powerPellet" : "pellet", onCollect }}
    >
      <sphereGeometry args={isPowerPellet ? [0.3, 8, 8] : [0.1, 8, 8]} />
      <meshStandardMaterial color={isPowerPellet ? "#ec4899" : "#facc15"} />
    </mesh>
  );
};

type PacManProps = {
  position: Vector3;
  direction: Direction;
  mouthOpen: number;
};

const PacMan = ({ position, direction, mouthOpen }: PacManProps) => {
  const ref = useRef<Group>(null);

  useEffect(() => {
    // Rotate Pacman based on direction
    if (!ref.current) return;

    // Reset rotation first
    ref.current.rotation.set(0, 0, 0);

    if (direction.equals(DIRECTIONS.UP)) {
      ref.current.rotation.x = -Math.PI / 2;
    } else if (direction.equals(DIRECTIONS.DOWN)) {
      ref.current.rotation.x = Math.PI / 2;
    } else if (direction.equals(DIRECTIONS.LEFT)) {
      ref.current.rotation.y = Math.PI;
    } else if (direction.equals(DIRECTIONS.RIGHT)) {
      // Right is the default orientation
    }
  }, [direction]);

  // Convert mouthOpen from 0-1 to an angle between 0 and PI/4
  const angle = (Math.PI / 4) * mouthOpen;

  return (
    <group ref={ref} position={position} name="pacman">
      {/* Single mesh for Pacman with cutout mouth */}
      <mesh>
        {/* Use a complete sphere */}
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#facc15" />
      </mesh>

      {/* Black mouth wedge that creates the appearance of an opening */}
      <mesh position={[0.25, 0, 0]}>
        <cylinderGeometry
          args={[
            0.52, // Top radius (slightly larger than sphere)
            0.52, // Bottom radius
            1.1, // Height
            32, // Radial segments
            1, // Height segments
            false, // Open ended
            0, // Start angle
            angle, // End angle - varies with mouthOpen
          ]}
        />
        <meshBasicMaterial color="black" />
      </mesh>
    </group>
  );
};

type GhostProps = {
  position: Vector3;
  color: string;
  scared: boolean;
};

const Ghost = ({ position, color, scared }: GhostProps) => {
  const ref = useRef<Group>(null);

  useFrame(() => {
    // Make ghost float up and down
    if (ref.current) {
      ref.current.position.y = Math.sin(Date.now() * 0.003) * 0.1 + 0.5;
    }
  });

  return (
    <group position={position}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 16, 0, Math.PI * 2, 0, Math.PI]} />
          <meshStandardMaterial color={scared ? "#6b7280" : color} />
        </mesh>
        {/* Eyes */}
        <group position={[0.2, 0.1, -0.3]} rotation={[0, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, -0.08]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
        <group position={[-0.2, 0.1, -0.3]} rotation={[0, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, -0.08]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="black" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Game component
const Game = () => {
  const { scene } = useThree();
  const [pacmanPosition, setPacmanPosition] = useState<Vector3>(
    new Vector3(1, 0, 1), // Top-left corner
  );
  const [direction, setDirection] = useState<Direction>(DIRECTIONS.RIGHT); // Initially facing right
  const [nextDirection, setNextDirection] = useState<Direction>(
    DIRECTIONS.NONE,
  );
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [ghostsScared, setGhostsScared] = useState<boolean>(false);
  const [mouthOpen, setMouthOpen] = useState<number>(1);
  const [pellets, setPellets] = useState<PelletData[]>([]);
  const [walls, setWalls] = useState<[number, number, number][]>([]);
  const [ghosts, setGhosts] = useState<GhostData[]>([
    {
      id: 1,
      position: new Vector3(9, 0, 9),
      color: "#ef4444",
      direction: DIRECTIONS.UP,
    },
    {
      id: 2,
      position: new Vector3(8, 0, 9),
      color: "#f97316",
      direction: DIRECTIONS.LEFT,
    },
    {
      id: 3,
      position: new Vector3(10, 0, 9),
      color: "#22c55e",
      direction: DIRECTIONS.RIGHT,
    },
    {
      id: 4,
      position: new Vector3(9, 0, 8),
      color: "#3b82f6",
      direction: DIRECTIONS.UP,
    },
  ]);

  // Constants for collision detection
  const WALL_COLLISION_THRESHOLD = 0.4; // Increased collision margin for walls
  const GHOST_COLLISION_RADIUS = 0.9; // Increased collision radius for ghosts
  const PELLET_COLLECTION_RADIUS = 0.6; // Increased pickup radius for pellets

  // Initialize game
  useEffect(() => {
    const newPellets: PelletData[] = [];
    const newWalls: [number, number, number][] = [];

    // Create walls and pellets based on map
    for (let z = 0; z < MAP.length; z++) {
      for (let x = 0; x < MAP[0].length; x++) {
        if (MAP[z][x] === 1) {
          // Wall - just store the position, we'll render it with JSX
          newWalls.push([x, 0, z]);
        } else if (MAP[z][x] === 2 || MAP[z][x] === 3) {
          // Pellet or Power Pellet
          newPellets.push({
            id: `pellet-${x}-${z}`,
            position: new Vector3(x, 0, z),
            isPowerPellet: MAP[z][x] === 3,
            collected: false,
          });
        }
      }
    }

    setPellets(newPellets);
    setWalls(newWalls);

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key) {
        case "ArrowUp":
          setNextDirection(DIRECTIONS.UP);
          break;
        case "ArrowDown":
          setNextDirection(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
          setNextDirection(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
          setNextDirection(DIRECTIONS.RIGHT);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Start Pacman moving right from the corner
    setDirection(DIRECTIONS.RIGHT);
    setPacmanPosition(new Vector3(1, 0, 1));

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Animate pacman's mouth
  useEffect(() => {
    let mouthAnimation: NodeJS.Timeout;
    if (!gameOver) {
      mouthAnimation = setInterval(() => {
        setMouthOpen((prev) => (prev > 0 ? prev - 0.2 : 1));
      }, 100);
    }

    return () => {
      clearInterval(mouthAnimation);
    };
  }, [gameOver]);

  // Handle ghost scared mode
  useEffect(() => {
    let scaredTimer: NodeJS.Timeout;
    if (ghostsScared) {
      scaredTimer = setTimeout(() => {
        setGhostsScared(false);
      }, 10000);
    }

    return () => {
      clearTimeout(scaredTimer);
    };
  }, [ghostsScared]);

  // Game loop
  useFrame((_, delta) => {
    if (gameOver) return;

    // Check if we can change to the next direction
    const nextPos = pacmanPosition.clone().add(nextDirection);
    const canChangeDirection = !checkWallCollision(
      nextPos.x,
      nextPos.z,
      WALL_COLLISION_THRESHOLD,
    );

    if (canChangeDirection && !nextDirection.equals(DIRECTIONS.NONE)) {
      setDirection(nextDirection);
      setNextDirection(DIRECTIONS.NONE);
    }

    // Move Pacman
    if (!direction.equals(DIRECTIONS.NONE)) {
      // Clamp delta to prevent jumps on frame drops
      const clampedDelta = Math.min(delta, 0.1);
      const speed = 3.5; // Slightly faster for better responsiveness

      const newPosition = pacmanPosition
        .clone()
        .add(direction.clone().multiplyScalar(speed * clampedDelta));

      // Check for collision with walls using improved collision detection
      if (
        !checkWallCollision(
          newPosition.x,
          newPosition.z,
          WALL_COLLISION_THRESHOLD,
        )
      ) {
        setPacmanPosition(newPosition);

        // Check for pellet collection with improved radius
        checkPelletCollection(newPosition, PELLET_COLLECTION_RADIUS);

        // Check for ghost collisions with improved radius
        checkGhostCollisions(newPosition, GHOST_COLLISION_RADIUS);
      }
    }

    // Move ghosts with improved collision detection
    moveGhosts(delta, WALL_COLLISION_THRESHOLD);
  });

  // Enhanced wall collision detection with adjustable threshold
  const checkWallCollision = (
    x: number,
    z: number,
    threshold = 0.5,
  ): boolean => {
    // Check the cell the entity is currently in
    const centerX = Math.round(x);
    const centerZ = Math.round(z);

    // Calculate distance from center of current cell
    const distX = Math.abs(x - centerX);
    const distZ = Math.abs(z - centerZ);

    // Check if we're close to a wall in the current position or in adjacent cells
    if (isWall(centerX, centerZ)) return true;

    // Check adjacent cells only if we're close enough to their boundaries
    if (distX > 1 - threshold) {
      const adjX = x > centerX ? centerX + 1 : centerX - 1;
      if (isWall(adjX, centerZ)) return true;
    }

    if (distZ > 1 - threshold) {
      const adjZ = z > centerZ ? centerZ + 1 : centerZ - 1;
      if (isWall(centerX, adjZ)) return true;
    }

    // Check diagonal cells if we're close to corners
    if (distX > 1 - threshold && distZ > 1 - threshold) {
      const adjX = x > centerX ? centerX + 1 : centerX - 1;
      const adjZ = z > centerZ ? centerZ + 1 : centerZ - 1;
      if (isWall(adjX, adjZ)) return true;
    }

    return false;
  };

  // Check if a position contains a wall (basic lookup)
  const isWall = (x: number, z: number): boolean => {
    if (x < 0 || z < 0 || x >= MAP[0].length || z >= MAP.length) return true;
    return MAP[z][x] === 1;
  };

  // Check if Pacman collected any pellets with improved radius
  const checkPelletCollection = (position: Vector3, radius = 0.5): void => {
    setPellets((prevPellets) => {
      const newPellets = [...prevPellets];
      const pelletIndex = newPellets.findIndex(
        (p) => !p.collected && position.distanceTo(p.position) < radius,
      );

      if (pelletIndex !== -1) {
        newPellets[pelletIndex].collected = true;

        if (newPellets[pelletIndex].isPowerPellet) {
          setGhostsScared(true);
        }

        setScore(
          (prev) => prev + (newPellets[pelletIndex].isPowerPellet ? 50 : 10),
        );

        // Check if all pellets are collected
        if (newPellets.every((p) => p.collected)) {
          setGameOver(true);
        }
      }

      return newPellets;
    });
  };

  // Move ghosts with improved collision detection
  const moveGhosts = (delta: number, wallThreshold = 0.5): void => {
    setGhosts((prevGhosts) => {
      return prevGhosts.map((ghost) => {
        // Simple ghost AI: change direction randomly or when hitting a wall
        let newDirection = ghost.direction;
        const shouldChangeDirection =
          Math.random() < 0.01 ||
          checkWallCollision(
            ghost.position.x + ghost.direction.x * wallThreshold,
            ghost.position.z + ghost.direction.z * wallThreshold,
            wallThreshold,
          );

        if (shouldChangeDirection) {
          // Find possible directions
          const possibleDirections = [
            DIRECTIONS.UP,
            DIRECTIONS.DOWN,
            DIRECTIONS.LEFT,
            DIRECTIONS.RIGHT,
          ].filter((dir) => {
            const newPos = ghost.position
              .clone()
              .add(dir.clone().multiplyScalar(wallThreshold));
            return !checkWallCollision(newPos.x, newPos.z, wallThreshold);
          });

          if (possibleDirections.length > 0) {
            newDirection =
              possibleDirections[
                Math.floor(Math.random() * possibleDirections.length)
              ]!;
          }
        }

        // Calculate new position
        const speed = ghostsScared ? 1.0 : 1.5;
        const newPosition = ghost.position
          .clone()
          .add(newDirection.clone().multiplyScalar(speed * delta));

        // Check for wall collision with improved detection
        if (!checkWallCollision(newPosition.x, newPosition.z, wallThreshold)) {
          return {
            ...ghost,
            position: newPosition,
            direction: newDirection,
          };
        }

        return ghost;
      });
    });
  };

  // Check for collisions with ghosts using improved radius
  const checkGhostCollisions = (position: Vector3, radius = 0.8): void => {
    ghosts.forEach((ghost) => {
      const distance = position.distanceTo(ghost.position);

      if (distance < radius) {
        if (ghostsScared) {
          // Ghost is scared, send it back to the center
          setGhosts((prevGhosts) =>
            prevGhosts.map((g) =>
              g.id === ghost.id ? { ...g, position: new Vector3(9, 0, 9) } : g,
            ),
          );

          setScore((prev) => prev + 200);
        } else {
          // Pacman got caught
          setLives((prev) => prev - 1);

          if (lives <= 1) {
            setGameOver(true);
          } else {
            // Reset Pacman position
            setPacmanPosition(new Vector3(1, 0, 1)); // Reset to starting position
            setDirection(DIRECTIONS.RIGHT); // Reset direction
            setNextDirection(DIRECTIONS.NONE);
          }
        }
      }
    });
  };

  return (
    <>
      {/* Lighting for top-down view */}
      <ambientLight intensity={1.0} />
      {/* <directionalLight position={[0, 10, 0]} intensity={0.8} castShadow /> */}

      {/* Game board */}
      <group position={[-MAP[0].length / 2, 0, -MAP.length / 2]}>
        {/* Walls */}
        {walls.map((position, index) => (
          <Wall key={`wall-${index}`} position={position} />
        ))}

        {/* Floor */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[MAP[0].length / 2, -0.5, MAP.length / 2]}
          receiveShadow
        >
          <planeGeometry args={[MAP[0].length, MAP.length]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        {/* Pellets */}
        {pellets.map(
          (pellet) =>
            !pellet.collected && (
              <Pellet
                key={pellet.id}
                position={pellet.position}
                isPowerPellet={pellet.isPowerPellet}
              />
            ),
        )}

        {/* Pacman */}
        <PacMan
          position={pacmanPosition}
          direction={direction}
          mouthOpen={mouthOpen}
        />

        {/* Ghosts */}
        {ghosts.map((ghost) => (
          <Ghost
            key={ghost.id}
            position={ghost.position}
            color={ghost.color}
            scared={ghostsScared}
          />
        ))}
      </group>
    </>
  );
};

// Main Pacman component with fixed camera
const Pacman = () => {
  const [showControls, setShowControls] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);

  return (
    <div className="h-dvh w-dvw">
      <Canvas
        shadows
        camera={{
          position: [0, 20, 0], // Fixed position high above the map
          fov: 50,
          near: 0.1,
          far: 1000,
          // Remove the lookAt property which causes the error
          up: [0, 0, -1], // Adjust up vector for proper orientation
        }}
      >
        {/* Add OrthographicCamera component to properly look at the scene */}
        <OrbitControls
          enableRotate={false}
          enablePan={false}
          enableZoom={false}
          target={[0, 0, 0]}
        />
        <Game />
      </Canvas>
    </div>
  );
};

export default Pacman;
