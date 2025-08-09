import { useCallback, useEffect, useRef, useState } from "react";
import usePartySocket from "partysocket/react";
import type { Player, PlayerMap, ClientMessage } from "./types";

export type PlayroomConfig = {
  host: string;
  party: string;
  room: string;
};

type PlayroomPlayer = Player & {
  isHost?: boolean;
};

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

// Global state for the playroom session
let globalSocket: any = null;
let globalPlayers: Record<string, PlayroomPlayer> = {};
let globalMultiplayerState: Record<string, any> = {};
let globalPlayerId: string | null = null;
let globalIsHost: boolean = false;
let globalIsConnected: boolean = false;
let globalConnectionStatus: ConnectionStatus = "connecting";
let subscribers: Set<() => void> = new Set();

function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

// Hook to establish the playroom connection (should be called once at the root)
export function usePlayroomRoot(config: PlayroomConfig) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [isConnected, setIsConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);

  // Connect to PartySocket
  const socket = usePartySocket({
    host: config.host,
    party: config.party,
    room: config.room,
  });

  // Handle socket events
  useEffect(() => {
    globalSocket = socket;

    const handleOpen = () => {
      console.log(`🔗 [usePlayroomRoot] Socket opened, ID: ${socket.id}`);
      
      globalPlayerId = socket.id || null;
      globalIsConnected = true;
      globalConnectionStatus = "connected";
      
      setIsConnected(true);
      setConnectionStatus("connected");
      setPlayerId(socket.id || null);
      
      notifySubscribers();
    };

    const handleMessage = (event: MessageEvent) => {
      try {
        const message: { type: string; data: any; playerId?: string } = JSON.parse(event.data);
        console.log(`📨 [usePlayroomRoot] Received message:`, message.type, message.data);

        switch (message.type) {
          case "player_joined":
            console.log(`👤 [usePlayroomRoot] Player joined:`, message.data);
            const joinedPlayer = message.data as Player;
            globalPlayers[joinedPlayer.id] = {
              ...joinedPlayer,
              isHost: joinedPlayer.metadata?.isHost === true
            };
            
            // Update host status if this is the current player
            if (joinedPlayer.id === globalPlayerId) {
              globalIsHost = joinedPlayer.metadata?.isHost === true;
            }
            
            notifySubscribers();
            break;

          case "player_left":
            console.log(`👋 [usePlayroomRoot] Player left:`, message.data);
            delete globalPlayers[message.data.id];
            notifySubscribers();
            break;

          case "player_updated":
            console.log(`🔄 [usePlayroomRoot] Player updated:`, message.data);
            const updatedPlayer = message.data as Player;
            globalPlayers[updatedPlayer.id] = {
              ...updatedPlayer,
              isHost: updatedPlayer.metadata?.isHost === true
            };
            
            // Update host status if this is the current player
            if (updatedPlayer.id === globalPlayerId) {
              globalIsHost = updatedPlayer.metadata?.isHost === true;
            }
            
            notifySubscribers();
            break;

          case "game_sync":
            console.log(`🔄 [usePlayroomRoot] Game sync received:`, message.data);
            const syncData = message.data as any;
            
            // Update players with host status from server
            Object.values(syncData.players).forEach((player: any) => {
              globalPlayers[player.id] = {
                ...player,
                isHost: player.metadata?.isHost === true
              };
            });
            
            // Update multiplayer state from server
            if (syncData.gameState && syncData.gameState.multiplayerState) {
              globalMultiplayerState = syncData.gameState.multiplayerState;
            }
            
            // Update host status if current player is in the list
            if (globalPlayerId && syncData.players[globalPlayerId]) {
              globalIsHost = syncData.players[globalPlayerId]?.metadata?.isHost === true;
            }
            
            notifySubscribers();
            break;

          default:
            console.warn("Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    const handleClose = () => {
      globalIsConnected = false;
      globalConnectionStatus = "disconnected";
      setIsConnected(false);
      setConnectionStatus("disconnected");
      notifySubscribers();
    };

    const handleError = () => {
      globalConnectionStatus = "error";
      setConnectionStatus("error");
      notifySubscribers();
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      globalSocket = null;
      globalPlayers = {};
      globalMultiplayerState = {};
      globalPlayerId = null;
      globalIsHost = false;
      globalIsConnected = false;
      globalConnectionStatus = "connecting";
    };
  }, []);

  // Utility functions for sending messages
  const updateGameState = useCallback((newState: Record<string, any>) => {
    if (socket.readyState === WebSocket.OPEN) {
      const message: ClientMessage<Record<string, any>> = {
        type: "game_state_update",
        data: newState,
        playerId: globalPlayerId || undefined,
        timestamp: Date.now(),
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const updatePlayerGameState = useCallback((newState: Record<string, any>) => {
    if (socket.readyState === WebSocket.OPEN) {
      const message: ClientMessage<Record<string, any>> = {
        type: "player_state_update",
        data: newState,
        playerId: globalPlayerId || undefined,
        timestamp: Date.now(),
      };
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  const getPlayerById = useCallback((playerId: string): PlayroomPlayer | undefined => {
    return globalPlayers[playerId];
  }, []);

  const getPlayerCount = useCallback((): number => {
    return Object.keys(globalPlayers).length;
  }, []);

  return {
    // State
    isConnected,
    connectionStatus,
    playerId,
    players: globalPlayers,
    
    // Actions
    updateGameState,
    updatePlayerGameState,
    
    // Utilities
    getPlayerById,
    getPlayerCount,
    
    // Raw socket for advanced usage
    socket,
  };
}

// PlayroomKit-style hooks

/**
 * Hook to manage multiplayer state that is synchronized across all players
 * @param key - The key to store the state under
 * @param defaultValue - Default value if the state doesn't exist
 * @returns [state, setState] tuple
 */
export function useMultiplayerState<T>(
  key: string, 
  defaultValue: T
): [T, (value: T, reliable?: boolean) => void] {
  const [localState, setLocalState] = useState<T>(
    globalMultiplayerState[key] ?? defaultValue
  );
  
  const updateState = useCallback((newValue: T, reliable: boolean = true) => {
    // Update global state
    globalMultiplayerState[key] = newValue;
    setLocalState(newValue);
    
    // Sync to server using the special multiplayerState wrapper
    if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
      const message: ClientMessage<Record<string, any>> = {
        type: "game_state_update",
        data: { 
          multiplayerState: { [key]: newValue }
        },
        playerId: globalPlayerId || undefined,
        timestamp: Date.now(),
      };
      globalSocket.send(JSON.stringify(message));
    }
    
    notifySubscribers();
  }, [key]);

  // Subscribe to global state changes
  useEffect(() => {
    const callback = () => {
      const currentValue = globalMultiplayerState[key] ?? defaultValue;
      setLocalState(currentValue);
    };
    
    subscribers.add(callback);
    
    return () => {
      subscribers.delete(callback);
    };
  }, [key, defaultValue]);

  return [localState, updateState];
}

/**
 * Hook to get the list of all players
 * @param triggerOnPlayerStateChange - Whether to trigger re-renders on player state changes
 * @returns Array of player objects
 */
export function usePlayersList(triggerOnPlayerStateChange: boolean = false): PlayroomPlayer[] {
  const [players, setPlayers] = useState<PlayroomPlayer[]>(Object.values(globalPlayers));

  useEffect(() => {
    const callback = () => {
      setPlayers(Object.values(globalPlayers));
    };
    
    subscribers.add(callback);
    
    return () => {
      subscribers.delete(callback);
    };
  }, [triggerOnPlayerStateChange]);

  return players;
}

/**
 * Hook to manage state for a specific player
 * @param player - The player object (can be null)
 * @param key - The key to store the state under
 * @param defaultValue - Default value if the state doesn't exist
 * @returns [state, setState] tuple
 */
export function usePlayerState<T>(
  player: PlayroomPlayer | null, 
  key: string, 
  defaultValue: T
): [T, (value: T, reliable?: boolean) => void] {
  const playerState = (player?.state as any) || {};
  const [localState, setLocalState] = useState<T>(playerState[key] ?? defaultValue);
  
  const updateState = useCallback((newValue: T, reliable: boolean = true) => {
    // Only allow updating own state and if player exists
    if (!player || player.id !== globalPlayerId) {
      if (!player) {
        console.warn("Cannot update state: player is null");
      } else {
        console.warn("Cannot update state for another player");
      }
      return;
    }
    
    setLocalState(newValue);
    
    // Sync to server
    if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
      const message: ClientMessage<Record<string, any>> = {
        type: "player_state_update",
        data: { [key]: newValue },
        playerId: globalPlayerId || undefined,
        timestamp: Date.now(),
      };
      globalSocket.send(JSON.stringify(message));
    }
  }, [player?.id, key]);

  // Subscribe to player state changes
  useEffect(() => {
    const callback = () => {
      if (player) {
        const updatedPlayer = globalPlayers[player.id];
        if (updatedPlayer) {
          const updatedPlayerState = (updatedPlayer.state as any) || {};
          const currentValue = updatedPlayerState[key] ?? defaultValue;
          setLocalState(currentValue);
        }
      }
    };
    
    subscribers.add(callback);
    
    return () => {
      subscribers.delete(callback);
    };
  }, [player?.id, key, defaultValue]);

  return [localState, updateState];
}

/**
 * Hook to get state for all players for a specific key
 * @param key - The state key to retrieve for all players
 * @returns Array of {player, state} objects
 */
export function usePlayersState<T>(key: string): Array<{player: PlayroomPlayer, state: T}> {
  const [playersState, setPlayersState] = useState<Array<{player: PlayroomPlayer, state: T}>>([]);

  useEffect(() => {
    const callback = () => {
      const result = Object.values(globalPlayers).map(player => ({
        player,
        state: ((player.state as any) || {})[key] as T
      }));
      setPlayersState(result);
    };
    
    subscribers.add(callback);
    callback(); // Initial call
    
    return () => {
      subscribers.delete(callback);
    };
  }, [key]);

  return playersState;
}

/**
 * Hook to determine if the current player is the host
 * @returns boolean indicating if current player is host
 */
export function useIsHost(): boolean {
  const [isHost, setIsHost] = useState(globalIsHost);

  useEffect(() => {
    const callback = () => {
      setIsHost(globalIsHost);
    };
    
    subscribers.add(callback);
    
    return () => {
      subscribers.delete(callback);
    };
  }, []);

  return isHost;
}

/**
 * Hook to get the current player
 * @returns The current player object or null
 */
export function useMyPlayer(): PlayroomPlayer | null {
  const [myPlayer, setMyPlayer] = useState<PlayroomPlayer | null>(
    globalPlayerId ? globalPlayers[globalPlayerId] || null : null
  );

  useEffect(() => {
    const callback = () => {
      setMyPlayer(globalPlayerId ? globalPlayers[globalPlayerId] || null : null);
    };
    
    subscribers.add(callback);
    
    return () => {
      subscribers.delete(callback);
    };
  }, []);

  return myPlayer;
}

// Utility functions

/**
 * Get a player by ID
 * @param playerId - The player ID
 * @returns The player object or undefined
 */
export function getPlayer(playerId: string): PlayroomPlayer | undefined {
  return globalPlayers[playerId];
}

/**
 * Get the current player ID
 * @returns The current player ID or null
 */
export function getMyPlayerId(): string | null {
  return globalPlayerId;
}

/**
 * Check if the game is connected
 * @returns boolean indicating connection status
 */
export function isConnected(): boolean {
  return globalIsConnected;
}

/**
 * Get the number of connected players
 * @returns Number of players
 */
export function getPlayerCount(): number {
  return Object.keys(globalPlayers).length;
}