import { createSlice } from '@reduxjs/toolkit';
import { themeSong } from 'styles/sound';

interface CurrentSettings {
  isMusicOn: boolean;
  isSFXOn: boolean;
}

type CurrentAppState = {
  userId: string | null;
} & CurrentSettings;

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
      if (!state.isMusicOn) {
        themeSong.pause();
      } else {
        themeSong.play();
      }
    },
    toggleSFX(state) {
      state.isSFXOn = !state.isSFXOn;
    }
  }
});

export const { toggleMusic, toggleSFX } = appSlice.actions;

export default appSlice.reducer;
