import create from "zustand";
import { persist } from "zustand/middleware";

type GameStore = {
  playerName: string;
  setPlayerName: (name: string) => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      playerName: "",
      setPlayerName: (playerName) => set((state) => ({ ...state, playerName })),
    }),
    {
      name: "playhouse-game-storage",
    }
  )
);
