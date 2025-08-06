import { useCallback, useEffect, useRef, useState } from "react";
import usePartySocket from "partysocket/react";

import type {
  ClientMessage,
  GameConfig,
  GameState,
  Player,
  PlayerMap,
} from "./types";

export type MultiplayerGameConfig<TGameState = unknown, TPayload = unknown, TSettings = Record<string, unknown>> = {
  host: string;
  party: string;
  room: string;
  gameConfig?: GameConfig<TSettings>;
  onPlayerJoined?: (player: Player) => void;
  onPlayerLeft?: (playerId: string) => void;
  onPlayerUpdated?: (player: Player) => void;
  onGameSync?: (players: PlayerMap, gameState?: GameState<TGameState>) => void;
  onGameEvent?: (event: string, payload: TPayload, from?: string) => void;
  onCustomMessage?: (data: unknown, from?: string) => void;
};

export type MultiplayerGameState<TGameState = unknown> = {
  isConnected: boolean;
  playerId: string | null;
  players: PlayerMap;
  gameState: GameState<TGameState>;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
};

export function useMultiplayerGame<TGameState = unknown, TPayload = unknown, TSettings = Record<string, unknown>>(
  config: MultiplayerGameConfig<TGameState, TPayload, TSettings>
) {
  const [gameState, setGameState] = useState<MultiplayerGameState<TGameState>>({
    isConnected: false,
    playerId: null,
    players: {},
    gameState: {} as TGameState,
    connectionStatus: "connecting",
  });

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Connect to PartySocket
  const socket = usePartySocket({
    host: config.host,
    party: config.party,
    room: config.room,
  });

  // Handle socket events
  useEffect(() => {
    const handleOpen = () => {
      console.log(`🔗 [useMultiplayerGame] Socket opened, ID: ${socket.id}`);
      
      setGameState((prev) => ({
        ...prev,
        isConnected: true,
        playerId: socket.id || null,
        connectionStatus: "connected",
      }));

      // Send join game message with config if provided
      if (config.gameConfig) {
        const joinMessage: ClientMessage<{ config: GameConfig<TSettings> }> = {
          type: "join_game",
          data: {
            config: config.gameConfig,
          },
          timestamp: Date.now(),
        };
        console.log(`📤 [useMultiplayerGame] Sending join_game:`, joinMessage);
        socket.send(JSON.stringify(joinMessage));
      }
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: { type: string; data: any; playerId?: string } = JSON.parse(event.data);
        console.log(`📨 [useMultiplayerGame] Received message:`, message.type, message.data);

        switch (message.type) {
          case "player_joined":
            console.log(`👤 [useMultiplayerGame] Player joined:`, message.data);
            setGameState((prev) => {
              const newState = {
                ...prev,
                players: {
                  ...prev.players,
                  [message.data.id]: message.data,
                },
              };
              console.log(`📊 [useMultiplayerGame] Updated players after join:`, Object.keys(newState.players));
              return newState;
            });
            config.onPlayerJoined?.(message.data as Player);
            break;

          case "player_left":
            console.log(`👋 [useMultiplayerGame] Player left:`, message.data);
            setGameState((prev) => {
              const newPlayers = { ...prev.players };
              delete newPlayers[message.data.id];
              console.log(`📊 [useMultiplayerGame] Updated players after leave:`, Object.keys(newPlayers));
              return {
                ...prev,
                players: newPlayers,
              };
            });
            config.onPlayerLeft?.((message.data as { id: string }).id);
            break;

          case "player_updated":
            console.log(`🔄 [useMultiplayerGame] Player updated:`, message.data);
            setGameState((prev) => {
              const newState = {
                ...prev,
                players: {
                  ...prev.players,
                  [message.data.id]: message.data,
                },
              };
              console.log(`📊 [useMultiplayerGame] Updated players after update:`, Object.keys(newState.players));
              return newState;
            });
            config.onPlayerUpdated?.(message.data as Player);
            break;

          case "game_sync":
            console.log(`🔄 [useMultiplayerGame] Game sync received:`, message.data);
            const syncData = message.data as any;
            setGameState((prev) => {
              const newState = {
                ...prev,
                players: syncData.players,
                gameState: syncData.gameState || {},
              };
              console.log(`📊 [useMultiplayerGame] Synced players:`, Object.keys(newState.players));
              console.log(`📊 [useMultiplayerGame] Synced game state:`, newState.gameState);
              return newState;
            });
            config.onGameSync?.(syncData.players, syncData.gameState);
            break;

          case "game_event":
            const eventData = message.data as { event: string; payload: TPayload; from?: string };
            if (eventData.event === "custom_message") {
              config.onCustomMessage?.(eventData.payload, eventData.from);
            } else {
              config.onGameEvent?.(eventData.event, eventData.payload, eventData.from);
            }
            break;

          case "custom":
            config.onCustomMessage?.(message.data, message.playerId);
            break;

          default:
            console.warn("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    const handleClose = () => {
      setGameState((prev) => ({
        ...prev,
        isConnected: false,
        connectionStatus: "disconnected",
      }));
    };

    const handleError = () => {
      setGameState((prev) => ({
        ...prev,
        isConnected: false,
        connectionStatus: "error",
      }));
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleMessage);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("error", handleError);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleMessage);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("error", handleError);
    };
  }, [socket, config]);

  // Game state management functions
  const updatePlayerGameState = useCallback(
    (newState: Partial<GameState<TGameState>>) => {
      if (socket.readyState === WebSocket.OPEN) {
        const message: ClientMessage<Partial<GameState<TGameState>>> = {
          type: "player_state_update",
          data: newState,
          playerId: gameStateRef.current.playerId || undefined,
          timestamp: Date.now(),
        };
        socket.send(JSON.stringify(message));
      }
    },
    [socket],
  );

  const updateGameState = useCallback(
    (newState: Partial<TGameState>) => {
      if (socket.readyState === WebSocket.OPEN) {
        const message: ClientMessage<Partial<TGameState>> = {
          type: "game_state_update",
          data: newState,
          playerId: gameStateRef.current.playerId || undefined,
          timestamp: Date.now(),
        };
        socket.send(JSON.stringify(message));
      }
    },
    [socket],
  );

  const sendGameAction = useCallback(
    (action: string, payload: TPayload) => {
      if (socket.readyState === WebSocket.OPEN) {
        const message: ClientMessage<{ action: string; payload: TPayload }> = {
          type: "game_action",
          data: { action, payload },
          playerId: gameStateRef.current.playerId || undefined,
          timestamp: Date.now(),
        };
        socket.send(JSON.stringify(message));
      }
    },
    [socket],
  );

  const sendCustomMessage = useCallback(
    (data: unknown) => {
      if (socket.readyState === WebSocket.OPEN) {
        const message: ClientMessage<unknown> = {
          type: "custom",
          data,
          playerId: gameStateRef.current.playerId || undefined,
          timestamp: Date.now(),
        };
        socket.send(JSON.stringify(message));
      }
    },
    [socket],
  );

  const leaveGame = useCallback(() => {
    if (socket.readyState === WebSocket.OPEN) {
      const message: ClientMessage<Record<string, never>> = {
        type: "leave_game",
        data: {},
        playerId: gameStateRef.current.playerId || undefined,
        timestamp: Date.now(),
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const getPlayerById = useCallback((playerId: string): Player | undefined => {
    return gameStateRef.current.players[playerId];
  }, []);

  const getCurrentPlayer = useCallback((): Player | undefined => {
    if (!gameStateRef.current.playerId) return undefined;
    return gameStateRef.current.players[gameStateRef.current.playerId];
  }, []);

  const getPlayerCount = useCallback((): number => {
    return Object.keys(gameStateRef.current.players).length;
  }, []);

  return {
    // State
    ...gameState,

    // Actions
    updatePlayerGameState,
    updateGameState,
    sendGameAction,
    sendCustomMessage,
    leaveGame,

    // Utilities
    getPlayerById,
    getCurrentPlayer,
    getPlayerCount,

    // Raw socket for advanced usage
    socket,
  };
}
