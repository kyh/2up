import { createSlice } from '@reduxjs/toolkit';
import { themeSong } from 'styles/sound';

type CurrentAppState = {
  userId: string | null;
  name: string;
  isHost: boolean;
  isMusicOn: boolean;
  isSFXOn: boolean;
};

export const initialState: CurrentAppState = {
  userId: null,
  name: localStorage.getItem('name') || '',
  isHost: false,
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
    },
    updateUser(state, { payload }) {
      state.userId = payload.userId ?? state.userId;
      state.name = payload.name ?? state.name;
      state.isHost = payload.isHost ?? state.isHost;
    }
  }
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;
