import { createSlice } from '@reduxjs/toolkit';
import { themeSong } from 'styles/sound';

type CurrentAppState = {
  userId: string | null;
  isMusicOn: boolean;
  isSFXOn: boolean;
};

let initialState: CurrentAppState = {
  userId: null,
  isMusicOn: localStorage.getItem('isMusicOn') === 'true',
  isSFXOn: localStorage.getItem('isSFXOn') === 'true'
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleMusic(state) {
      state.isMusicOn = !state.isMusicOn;
      if (state.isMusicOn) {
        themeSong.play();
      } else {
        themeSong.pause();
      }
      localStorage.setItem('isMusicOn', state.isMusicOn.toString());
    },
    toggleSFX(state) {
      state.isSFXOn = !state.isSFXOn;
      localStorage.setItem('isSFXOn', state.isSFXOn.toString());
    }
  }
});

export const { toggleMusic, toggleSFX } = appSlice.actions;
export const appReducer = appSlice.reducer;
