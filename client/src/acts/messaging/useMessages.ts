import { useChannel } from 'use-phoenix-channel';

export type MessageType = {
  name: string;
  message: string;
};
export type EventNames = keyof typeof actions;
export type State = Array<MessageType>;
export type Response = { event: EventNames; payload: MessageType };

const channelName = 'room:lobby';
export const actions = {
  shout: 'shout'
};
const reducer = (state: State, { event, payload }: Response) => {
  switch (event) {
    case actions.shout:
      return [...state, { name: payload.name, message: payload.message }];
    default:
      return state;
  }
};
const initialState: State = [];

export const useMessages = () => {
  return useChannel(channelName, reducer, initialState);
};
