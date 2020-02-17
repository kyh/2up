import { useChannel } from 'context/Socket';
import { reducerLogger } from 'utils/reducerLogger';
import { GameState, ServerResponse, Player } from 'games/types';

export interface TriviaGameState extends GameState {
  act: number;
  scene: number;
  question?: string;
  answer?: string;
  players: Player[];
  submissions: Submission[];
}
export interface Submission {
  id: number;
  name: string;
  content: string;
  endorsers: Player[];
}

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

export const Events = {
  game: 'game',
  playerJoin: 'player:join',
  playerSubmit: 'player:submit'
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
    case 'phx_error':
      return {
        ...state,
        connected: false
      };
    case 'game_state':
      return {
        ...state,
        ...payload
      };
    case Events.game:
      return {
        ...state,
        ...payload
      };
    case Events.playerJoin:
      return {
        ...state,
        players: [...state.players, payload]
      };
    case Events.playerSubmit:
      return {
        ...state,
        submissions: [...state.submissions, payload]
      };
    default:
      return state;
  }
};

const eventsList = Object.keys(Events);
export const useTrivia = (code: string) => {
  return useChannel(
    `trivia:${code}`,
    reducerLogger(reducer, eventsList),
    initialState
  );
};
