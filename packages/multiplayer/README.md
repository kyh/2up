# @repo/multiplayer

React hooks for building multiplayer games with PlayroomKit-style API. Simple, ergonomic multiplayer development.

## Features

- **PlayroomKit-inspired API**: Familiar hooks following established conventions
- **Global state sync**: `useMultiplayerState` for game-wide state
- **Player state**: `usePlayerState` for individual player data
- **Host detection**: Built-in host assignment and management
- **Real-time sync**: Automatic state synchronization across clients
- **Full TypeScript support**: Complete type safety

## Installation

This package is already installed as a workspace dependency. Import hooks directly:

```typescript
import { 
  usePlayroomRoot, 
  useMultiplayerState, 
  usePlayersList, 
  usePlayerState,
  useIsHost 
} from '@repo/multiplayer';
```

## Quick Start

### 1. Initialize Playroom Connection

Use `usePlayroomRoot` at your app root to establish the multiplayer connection:

```tsx
import { usePlayroomRoot } from '@repo/multiplayer';

function App() {
  const game = usePlayroomRoot({
    host: "https://your-server.workers.dev",
    party: "game-server",
    room: "room-id",
  });

  if (!game.isConnected) {
    return <div>Connecting...</div>;
  }

  return <YourGame />;
}
```

### 2. Use Multiplayer State

Share state across all players:

```tsx
function GameComponent() {
  const [gameScore, setGameScore] = useMultiplayerState("score", 0);
  const [gamePhase, setGamePhase] = useMultiplayerState("phase", "waiting");

  return (
    <div>
      <div>Score: {gameScore}</div>
      <button onClick={() => setGameScore(gameScore + 1)}>
        Add Point
      </button>
    </div>
  );
}
```

### 3. Manage Player State

Handle individual player data:

```tsx
function PlayerProfile() {
  const myPlayer = useMyPlayer();
  const [playerName, setPlayerName] = usePlayerState(myPlayer, "name", "");
  const [health, setHealth] = usePlayerState(myPlayer, "health", 100);

  return (
    <div>
      <input 
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Your name"
      />
      <div>Health: {health}/100</div>
    </div>
  );
}
```

### 4. Host-Only Controls

Create host-only functionality:

```tsx
function HostControls() {
  const isHost = useIsHost();
  const [gameStarted, setGameStarted] = useMultiplayerState("started", false);

  if (!isHost) return null;

  return (
    <button onClick={() => setGameStarted(true)}>
      Start Game (Host Only)
    </button>
  );
}
```

## Available Hooks

### Core Hooks

- **`usePlayroomRoot(config)`** - Establish multiplayer connection (use once at root)
- **`useMultiplayerState(key, defaultValue)`** - Global state shared by all players  
- **`usePlayerState(player, key, defaultValue)`** - Individual player state
- **`usePlayersList(triggerOnStateChange?)`** - List of all connected players
- **`usePlayersState(key)`** - Get specific state for all players
- **`useIsHost()`** - Check if current player is the host
- **`useMyPlayer()`** - Get current player object

### Utility Functions

- **`getPlayer(playerId)`** - Get player by ID
- **`getMyPlayerId()`** - Get current player ID
- **`isConnected()`** - Check connection status
- **`getPlayerCount()`** - Get number of players

## Complete Example

```tsx
import {
  usePlayroomRoot,
  useMultiplayerState,
  usePlayersList,
  usePlayerState,
  useIsHost,
  useMyPlayer
} from '@repo/multiplayer';

function MultiplayerCounter() {
  // Root connection
  const game = usePlayroomRoot({
    host: "https://your-server.workers.dev",
    party: "game-server", 
    room: "counter-room"
  });

  // State hooks
  const [globalCounter, setGlobalCounter] = useMultiplayerState("counter", 0);
  const players = usePlayersList();
  const myPlayer = useMyPlayer();
  const isHost = useIsHost();
  const [myClicks, setMyClicks] = usePlayerState(myPlayer, "clicks", 0);

  if (!game.isConnected) return <div>Connecting...</div>;

  return (
    <div>
      <h1>Global Counter: {globalCounter}</h1>
      <div>Players: {players.length}</div>
      
      <button 
        onClick={() => {
          setGlobalCounter(globalCounter + 1);
          setMyClicks(myClicks + 1);
        }}
      >
        Click! (My clicks: {myClicks})
      </button>

      {isHost && (
        <button onClick={() => setGlobalCounter(0)}>
          Reset (Host Only)
        </button>
      )}

      <div>
        <h3>Players</h3>
        {players.map(player => (
          <div key={player.id}>
            {player.id.substring(0, 8)}: {(player.state as any)?.clicks || 0} clicks
            {player.isHost && " (Host)"}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Examples

- **Simple Demo**: `apps/nextjs/src/app/demo/page.tsx` - Ships game with cursor tracking
- **Advanced Demo**: `apps/nextjs/src/app/playroom-demo/page.tsx` - Full PlayroomKit showcase

## API Documentation

For complete API reference and migration guide, see [PLAYROOM_API.md](./PLAYROOM_API.md).

## Server Configuration

This package works with the PartyServer in `apps/party`. The server automatically handles:

- Host assignment (first player becomes host)
- Host reassignment when host leaves
- State synchronization
- Player management

## TypeScript Support

All hooks are fully typed:

```typescript
import type { 
  Player, 
  PlayroomConfig,
  PlayerMap, 
  GameState 
} from '@repo/multiplayer';
```