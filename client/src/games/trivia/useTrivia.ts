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
  act: 1,
  scene: 0,
  question: '',
  answer: '',
  submissions: [],
  connected: false
};

const reducer = (state: any, { event, payload }: Response) => {
  console.log('REDUCER EVENT', event);
  console.log('REDUCER PAYLOAD', payload);

  switch (event) {
    case 'phx_reply': {
      return {
        ...state,
        connected: true
      };
    }
    case 'game:scene1':
      return {
        ...state,
        question: payload.question,
        players: payload.players
      };
    case 'player:join':
      return {
        ...state,
        players: [...state.players, ...payload.players]
      };
    case 'player:submit':
      return {
        ...state,
        submissions: [...state.submissions, ...payload.submission]
      };
    default:
      return state;
  }
};

export const useTrivia = () => {
  return useChannel(channelName, reducer, initialState);
};
