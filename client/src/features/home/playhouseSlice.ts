import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { localStorage } from "util/window";
import { createOrGetThemesong } from "styles/sound";

export type UserPayload = {
  name: string;
};

export type CurrentAppState = {
  name: string;
  isMusicOn: boolean;
  isSFXOn: boolean;
  isDarkMode: boolean;
};

const getIsDarkMode = () => {
  const isDarkMode = localStorage.getItem("isDarkMode");
  if (isDarkMode === "true") return true;
  if (isDarkMode === "false") return false;
  if (typeof window !== "undefined" && window.matchMedia)
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  return true;
};

export const initialState: CurrentAppState = {
  name: localStorage.getItem("name") || "",
  isMusicOn: localStorage.getItem("isMusicOn"),
  isSFXOn: localStorage.getItem("isSFXOn"),
  isDarkMode: getIsDarkMode(),
};

const playhouseSlice = createSlice({
  name: "playhouse",
  initialState,
  reducers: {
    toggle_music: (state) => {
      const themeSong = createOrGetThemesong();
      state.isMusicOn = !state.isMusicOn;
      if (themeSong) {
        state.isMusicOn ? themeSong.play() : themeSong.pause();
      }
      localStorage.setItem("isMusicOn", state.isMusicOn);
    },
    toggle_SFX: (state) => {
      state.isSFXOn = !state.isSFXOn;
      localStorage.setItem("isSFXOn", state.isSFXOn);
    },
    toggle_dark_mode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", state.isDarkMode);
    },
    update_user: (state, { payload }: PayloadAction<UserPayload>) => {
      state.name = payload.name ?? state.name;
      if (state.name) localStorage.setItem("name", state.name);
    },
  },
});

export const playhouseActions = playhouseSlice.actions;
export const playhouseReducer = playhouseSlice.reducer;
