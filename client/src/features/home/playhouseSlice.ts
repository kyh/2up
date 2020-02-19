import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { themeSong } from 'styles/sound';

type UserPayload = {
  userId?: string;
  name?: string;
  isHost?: boolean;
};

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

const playhouseSlice = createSlice({
  name: 'playhouse',
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
    updateUser(state, { payload }: PayloadAction<UserPayload>) {
      state.userId = payload.userId ?? state.userId;
      state.name = payload.name ?? state.name;
      state.isHost = payload.isHost ?? state.isHost;

      if (state.name) {
        localStorage.setItem('name', state.name);
      }
    }
  }
});

export const playhouseActions = playhouseSlice.actions;
export const playhouseReducer = playhouseSlice.reducer;
