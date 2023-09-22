import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type HomeStore = {
  isMusicOn: boolean;
  toggleMusic: () => void;
  isSFXOn: boolean;
  toggleSFX: () => void;
  playerId: string;
  setPlayerId: (playerId: string) => void;
  playerName: string;
  setPlayerName: (name: string) => void;
  accessToken: string;
  setAccessToken: (accessToken: string) => void;
};

export const useHomeStore = create<HomeStore>()(
  persist(
    (set) => ({
      isMusicOn: false,
      toggleMusic: () =>
        set((state) => ({ ...state, isMusicOn: !state.isMusicOn })),
      isSFXOn: false,
      toggleSFX: () => set((state) => ({ ...state, isSFXOn: !state.isSFXOn })),
      playerId: nanoid(),
      setPlayerId: (playerId) => set((state) => ({ ...state, playerId })),
      playerName: "",
      setPlayerName: (playerName) => set((state) => ({ ...state, playerName })),
      accessToken: "",
      setAccessToken: (accessToken) =>
        set((state) => ({ ...state, accessToken })),
    }),
    {
      name: "2up-storage",
    }
  )
);

export const useAllHomeStore = () => useHomeStore((state) => state, shallow);
