# PlayroomKit-Style API

This document describes the new PlayroomKit-style hooks that provide a simple, ergonomic API for multiplayer game development.

## Getting Started

### 1. Initialize the Playroom

Use `usePlayroomRoot` at the root of your application to establish the multiplayer connection:

```tsx
import { usePlayroomRoot } from "@repo/multiplayer";

function App() {
  const game = usePlayroomRoot({
    host: "https://your-server.com",
    party: "your-party-name",
    room: "room-id",
  });

  if (!game.isConnected) {
    return <div>Connecting...</div>;
  }

  return <YourGame />;
}
```

## Core Hooks

### `useMultiplayerState(key, defaultValue)`

Manages state that is synchronized across all players.

```tsx
function GameComponent() {
  const [score, setScore] = useMultiplayerState("score", 0);
  const [gamePhase, setGamePhase] = useMultiplayerState("phase", "waiting");

  return (
    <div>
      <div>Score: {score}</div>
      <button onClick={() => setScore(score + 1)}>
        Increase Score
      </button>
    </div>
  );
}
```

### `usePlayersList(triggerOnPlayerStateChange?)`

Returns an array of all connected players.

```tsx
function PlayersList() {
  const players = usePlayersList(true); // Re-render on player state changes

  return (
    <div>
      {players.map(player => (
        <div key={player.id}>
          {player.id} {player.isHost && "(Host)"}
        </div>
      ))}
    </div>
  );
}
```

### `usePlayerState(player, key, defaultValue)`

Manages state for a specific player. Only the player themselves can update their state.

```tsx
function PlayerProfile({ player }) {
  const [playerName, setPlayerName] = usePlayerState(player, "name", "");
  const [health, setHealth] = usePlayerState(player, "health", 100);

  return (
    <div>
      <input 
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        disabled={player.id !== myPlayer?.id} // Only editable by the player
      />
      <div>Health: {health}</div>
    </div>
  );
}
```

### `usePlayersState(key)`

Returns the specified state for all players.

```tsx
function Leaderboard() {
  const playerScores = usePlayersState("score");

  return (
    <div>
      {playerScores
        .sort((a, b) => (b.state || 0) - (a.state || 0))
        .map(({ player, state }) => (
          <div key={player.id}>
            {player.id}: {state || 0}
          </div>
        ))}
    </div>
  );
}
```

### `useIsHost()`

Returns true if the current player is the host.

```tsx
function HostControls() {
  const isHost = useIsHost();
  const [gameStarted, setGameStarted] = useMultiplayerState("started", false);

  if (!isHost) return null;

  return (
    <button onClick={() => setGameStarted(true)}>
      Start Game
    </button>
  );
}
```

### `useMyPlayer()`

Returns the current player object.

```tsx
function MyPlayerInfo() {
  const myPlayer = useMyPlayer();
  
  if (!myPlayer) return <div>Connecting...</div>;

  return (
    <div>
      <div>Your ID: {myPlayer.id}</div>
      <div style={{ color: myPlayer.color }}>Your Color</div>
      {myPlayer.isHost && <div>You are the host!</div>}
    </div>
  );
}
```

## Utility Functions

### `getPlayer(playerId)`

Get a player by their ID.

```tsx
const player = getPlayer("player-id-123");
```

### `getMyPlayerId()`

Get the current player's ID.

```tsx
const myId = getMyPlayerId();
```

### `isConnected()`

Check if connected to the multiplayer session.

```tsx
if (isConnected()) {
  // Connected to multiplayer
}
```

### `getPlayerCount()`

Get the number of connected players.

```tsx
const count = getPlayerCount();
```

## Migration from Old Hooks

If you're migrating from the previous `useRealtimeGame` or `useMultiplayerGame` hooks:

### Before:
```tsx
const game = useRealtimeGame({
  host: "...",
  party: "...",
  room: "...",
  onPlayerJoined: (player) => { /* handle */ },
});

// Update player state
game.updatePlayerGameState({ score: 10 });

// Check if host
const isHost = game.players[game.playerId]?.metadata?.isHost;
```

### After:
```tsx
// At root level
const game = usePlayroomRoot({
  host: "...",
  party: "...",
  room: "...",
});

// In components
const [score, setScore] = usePlayerState(myPlayer, "score", 0);
const isHost = useIsHost();

setScore(10); // Automatically synced
```

## Best Practices

1. **Use `usePlayroomRoot` only once** at the root of your app
2. **Host-only actions**: Use `useIsHost()` to gate host-only functionality
3. **State organization**: Use descriptive keys for multiplayer and player state
4. **Performance**: Set `triggerOnPlayerStateChange` to `false` in `usePlayersList()` if you don't need updates on player state changes
5. **Error handling**: Always check if `myPlayer` is not null before using it with `usePlayerState`

## Example: Simple Multiplayer Counter

```tsx
function MultiplayerCounter() {
  const game = usePlayroomRoot({ host: "...", party: "...", room: "..." });
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
        {players.map(player => (
          <div key={player.id}>
            {player.id}: {(player.state as any)?.clicks || 0} clicks
            {player.isHost && " (Host)"}
          </div>
        ))}
      </div>
    </div>
  );
}
```