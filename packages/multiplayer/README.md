# @repo/multiplayer-hooks

React hooks for building multiplayer games with real-time synchronization. Designed for LLM-generated games in game builder platforms.

## Features

- **Real-time games**: Hook supporting position tracking, entity management, and real-time synchronization
- **Turn-based games**: Specialized hook for turn management and game phases  
- **Generic multiplayer**: Base hook for custom multiplayer functionality
- **Full TypeScript support**: Complete type safety for generated code

## Installation

This package is already installed as a workspace dependency. Import hooks directly:

```typescript
import { useRealtimeGame, useTurnBasedGame, useMultiplayerGame } from '@repo/multiplayer-hooks';
```

## Available Hooks

### `useRealtimeGame` - Real-time Games
Use for games requiring real-time synchronization like cursor tracking, action games, or any game with moving entities.

**Best for:** Drawing apps, shooters, racing games, platformers, real-time strategy games

### `useTurnBasedGame` - Turn-Based Games  
Use for games with distinct turns and phases where players take actions in sequence.

**Best for:** Board games, card games, chess, tic-tac-toe, strategy games

### `useMultiplayerGame` - Custom Implementation
Base hook for building custom multiplayer functionality when the above hooks don't fit your needs.

**Best for:** Custom game mechanics, hybrid games, or when you need full control

## Examples

### Real-time Game with Cursor Tracking

```tsx
import { useRealtimeGame } from '@repo/multiplayer-hooks';

function CursorGame() {
  const game = useRealtimeGame({
    host: "https://your-server.workers.dev",
    party: "game-server",
    room: "cursor-room",
    autoTrackCursor: true, // Automatically track mouse/touch movement
    tickRate: 20, // Smooth cursor updates
    interpolation: false, // Direct cursor positioning
    onPlayerMoved: (playerId, position) => {
      console.log(`Player ${playerId} moved to:`, position);
    }
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {Object.entries(game.players).map(([id, player]) => {
        const pos = player.gameState?.position;
        if (!pos) return null;
        
        return (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: player.color,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
    </div>
  );
}
```

### Turn-Based Game

```tsx
import { useTurnBasedGame } from '@repo/multiplayer-hooks';

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  
  const game = useTurnBasedGame({
    host: "https://your-server.workers.dev",
    party: "game-server",
    room: "tictactoe",
    minPlayers: 2,
    maxPlayers: 2,
    onPlayerMove: (playerId, move) => {
      setBoard(prev => {
        const newBoard = [...prev];
        newBoard[move.position] = move.symbol;
        return newBoard;
      });
    }
  });

  const makeMove = (position: number) => {
    if (!game.isMyTurn() || board[position]) return;
    
    game.makeMove({
      position,
      symbol: game.playerId === game.turnOrder[0] ? 'X' : 'O'
    });
  };

  return (
    <div>
      <div>Turn: {game.currentTurn} | Phase: {game.gamePhase}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => makeMove(index)}
            disabled={!game.isMyTurn() || !!cell}
          >
            {cell}
          </button>
        ))}
      </div>
      {game.gamePhase === 'waiting' && (
        <button onClick={game.startGame}>Start Game</button>
      )}
    </div>
  );
}
```

### Real-time Game with Entity Management

```tsx
import { useRealtimeGame } from '@repo/multiplayer-hooks';

function EntityGame() {
  const game = useRealtimeGame({
    host: "https://your-server.workers.dev",
    party: "game-server", 
    room: "realtime-game",
    tickRate: 60, // High frequency for responsive gameplay
    interpolation: true, // Smooth entity movement
    onPlayerAction: (playerId, action, data) => {
      if (action === 'shoot') {
        game.createEntity(`bullet-${Date.now()}`, {
          position: data.position,
          velocity: data.velocity,
          data: { type: 'bullet', owner: playerId }
        });
      }
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    game.sendAction('shoot', {
      position: { x, y },
      velocity: { x: 5, y: 0 }
    });
  };

  return (
    <canvas
      width={800}
      height={600}
      onClick={handleClick}
      style={{ border: '1px solid black' }}
    />
  );
}
```


## Available Hooks

### `useRealtimeGame` ⭐
**The main hook** - supports position tracking, entity management, and real-time synchronization for multiplayer games. Configure it for your specific use case:

**Example Configurations:**

```typescript
// Cursor/drawing apps
const game = useRealtimeGame({
  autoTrackCursor: true,
  tickRate: 20,
  interpolation: false,
});

// Fast-paced games with entities
const game = useRealtimeGame({
  tickRate: 60,
  interpolation: true,
  onPlayerAction: (id, action, data) => { /* handle actions */ }
});

// Hybrid games with both features
const game = useRealtimeGame({
  autoTrackCursor: true,
  tickRate: 30,
  interpolation: true,
  onPlayerAction: (id, action, data) => { /* handle actions */ },
  onPlayerMoved: (id, position) => { /* handle movement */ }
});
```

**Features:**
- Automatic cursor/touch tracking
- Entity management with interpolation
- Position tracking methods
- Configurable tick rates and throttling
- Game loop with delta time

### `useTurnBasedGame`
Specialized hook for turn-based games with built-in turn management, player queues, and game phase tracking.

### `useMultiplayerGame`
Base hook for all multiplayer functionality. Provides connection management, player synchronization, and custom message handling.

## Server Configuration

This package works with the PartyServer in `apps/party`. The server automatically handles different game types and message routing.

## TypeScript Support

All hooks are fully typed with TypeScript for excellent development experience:

```typescript
import type { Player, GameState, Position } from '@repo/multiplayer-hooks';
```

## Examples

See `apps/nextjs/src/app/demo/page.tsx` for a complete implementation using `useRealtimeGame` with cursor tracking.