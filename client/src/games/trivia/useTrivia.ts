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
  submissions: [],
  connected: false
};

const reducer = (state: any, { event, payload }: Response) => {
  console.log('REDUCER EVENT', event);
  console.log('REDUCER PAYLOAD', payload);
  console.log('REDUCER STATE', state);

  switch (event) {
    case 'phx_reply': {
      return {
        ...state,
        connected: true
      };
    }
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
  return useChannel(channelName, reducer, initialState);
};
