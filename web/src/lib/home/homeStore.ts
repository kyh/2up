import create from "zustand";
import shallow from "zustand/shallow";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type HomeStore = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
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

const getDarkModeDefault = () => {
  if (typeof window !== "undefined" && window.matchMedia)
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  return true;
};

export const useHomeStore = create<HomeStore>()(
  persist(
    (set) => ({
      isDarkMode: getDarkModeDefault(),
      toggleDarkMode: () =>
        set((state) => ({ ...state, isDarkMode: !state.isDarkMode })),
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
      name: "trifles-storage",
    }
  )
);

export const useAllHomeStore = () => useHomeStore((state) => state, shallow);
