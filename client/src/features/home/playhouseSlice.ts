import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { themeSong } from 'styles/sound';

type UserPayload = {
  userId?: string;
  name?: string;
};

type CurrentAppState = {
  userId: string | null;
  name: string;
  isMusicOn: boolean;
  isSFXOn: boolean;
};

export const initialState: CurrentAppState = {
  userId: null,
  name: localStorage.getItem('name') || '',
  isMusicOn: localStorage.getItem('isMusicOn') === 'true',
  isSFXOn: localStorage.getItem('isSFXOn') === 'true'
};

const playhouseSlice = createSlice({
  name: 'playhouse',
  initialState,
  reducers: {
    toggle_music(state) {
      state.isMusicOn = !state.isMusicOn;
      if (state.isMusicOn) {
        themeSong.play();
      } else {
        themeSong.pause();
      }
      localStorage.setItem('isMusicOn', state.isMusicOn.toString());
    },
    toggle_SFX(state) {
      state.isSFXOn = !state.isSFXOn;
      localStorage.setItem('isSFXOn', state.isSFXOn.toString());
    },
    update_user(state, { payload }: PayloadAction<UserPayload>) {
      state.userId = payload.userId ?? state.userId;
      state.name = payload.name ?? state.name;

      if (state.name) {
        localStorage.setItem('name', state.name);
      }
      if (state.userId) {
        localStorage.setItem('userId', state.userId);
      }
    }
  }
});

export const playhouseActions = playhouseSlice.actions;
export const playhouseReducer = playhouseSlice.reducer;
