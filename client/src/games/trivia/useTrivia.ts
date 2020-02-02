import { useChannel } from 'use-phoenix-channel';

export type State = {
  act: number;
  scene: number;
  question: string;
  answer: string;
  online: boolean;
};
export type Response = { event: any; payload: any };

const channelName = 'game:trivia';

const initialState = {
  act: null,
  scene: null,
  question: '',
  answer: '',
  players: [],
  submissions: [],
  connected: false
};

const reducer = (state: any, { event, payload }: Response) => {
  let newState;

  switch (event) {
    case 'phx_reply':
      newState = {
        ...state,
        connected: true
      };
      break;
    case 'game':
      newState = {
        ...state,
        ...payload
      };
      break;
    case 'player:join':
      newState = {
        ...state,
        players: [...state.players, payload]
      };
      break;
    case 'player:submit':
      newState = {
        ...state,
        submissions: [...state.submissions, payload]
      };
      break;
    default:
      return state;
  }

  console.log('REDUCER:', {
    event,
    payload,
    newState
  });

  return newState;
};

export const useTrivia = () => {
  return useChannel(channelName, reducer, initialState);
};
