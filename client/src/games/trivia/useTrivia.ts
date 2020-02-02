import { useChannel } from 'use-phoenix-channel';
import { reducerLogger } from 'utils/reducerLogger';
import { GameState, ServerResponse, Player } from 'games/types';

export interface TriviaGameState extends GameState {
  act: number;
  scene: number;
  question?: string;
  answer?: string;
  submissions: Submission[];
}
export interface Submission {
  playerName: string;
  content: string;
  endorsers: Player[];
}

const channelName = 'game:trivia';

export const initialState: TriviaGameState = {
  gameID: undefined,
  connected: false,
  players: [],
  act: 0,
  scene: 0,
  question: '',
  answer: '',
  submissions: []
};

const reducer = (
  state: TriviaGameState,
  { event, payload }: ServerResponse
) => {
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
