import { useChannel } from 'use-phoenix-channel';
import { reducerLogger } from 'utils/reducerLogger';

export type State = {
  act: number;
  scene: number;
  question: string;
  answer: string;
  connected: boolean;
};
export type Response = { event: any; payload: any };

const channelName = 'game:trivia';

export const initialState = {
  gameID: null,
  act: 0,
  scene: 0,
  question: '',
  answer: '',
  players: [],
  submissions: [],
  connected: false
};

const reducer = (state: any, { event, payload }: Response) => {
  switch (event) {
    case 'phx_reply':
      return {
        ...state,
        connected: true
      };
    case 'game':
      return {
        ...state,
        ...payload
      };
    case 'player:join':
      return {
        ...state,
        players: [...state.players, payload]
      };
    case 'player:submit':
      return {
        ...state,
        submissions: [...state.submissions, payload]
      };
    default:
      return state;
  }
};

export const useTrivia = () => {
  return useChannel(channelName, reducerLogger(reducer), initialState);
};
