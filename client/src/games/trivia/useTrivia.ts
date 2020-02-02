import { useChannel } from 'use-phoenix-channel';
import { acts } from './acts';

export type State = {
  act: number;
  scene: number;
  question: string;
  answer: string;
  players: Array<string>;
};
export type Response = { event: any; payload: any };

const channelName = 'game:trivia';

let submissionCount = 0

const reducer = (state: any, { event, payload }: any) => {
  console.log('REDUCER EVENT', event)
  console.log('REDUCER PAYLOAD', payload)

  switch (event) {
    case 'phx_reply': {
      return {
        ...state,
        isConnected: true
      }
    }
    case 'scene1':
      return {
        ...state,
        question: payload.question,
        players: payload.players
      }
    case 'player:submit':
      submissionCount += 1
      return {
        ...state,
        submissionCount,
        submission: payload.submission
      }
    case 'start':
      return {
        act: 1,
        scene: 1,
        question: acts[0].question,
        answer: acts[0].answer,
        isOnline: true,
        players: state.players
      };
    case 'join':
      return {
        ...state,
        players: payload.players,
        isOnline: true
      };
    case 'scene:next':
      return {
        ...state,
        act: 1,
        scene: state.scene + 1,
        question: acts[0].question,
        answer: acts[0].answer
      };
    case 'act:next':
      const nextAct = state.act + 1;
      return {
        ...state,
        act: nextAct,
        scene: 1,
        question: acts[nextAct].question,
        answer: acts[nextAct].answer
      };
    default:
      return state;
  }
};
const initialState = { act: 1, scene: 0, question: '', answer: '', isConnected: false };

export const useTrivia = () => {
  return useChannel(channelName, reducer, initialState);
};
