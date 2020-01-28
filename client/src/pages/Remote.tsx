import React from 'react';
import { Button } from 'components';
import { useChannel } from 'use-phoenix-channel';

const channelName = 'room:lobby';
const action = 'shout';

type Message = {
  name: string;
  message: string;
};

type State = Array<Message>;

const messageReducer = (
  state: State,
  { event, payload }: { event: any; payload: Message }
) => {
  switch (event) {
    case action:
      return [...state, { name: payload.name, message: payload.message }];
    default:
      return state;
  }
};
const initialState: State = [];

export const Remote = () => {
  const [state, broadcast] = useChannel(
    channelName,
    messageReducer,
    initialState
  );
  const [message, setMessage] = React.useState('');

  return (
    <div>
      <h2>Remote</h2>
      <div>
        {state.map((message: Message, i: number) => {
          return <div key={i}>{message.message}</div>;
        })}
      </div>
      <input
        type="text"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <Button
        onClick={() => {
          broadcast(action, { message });
          setMessage('');
        }}
      >
        Shout
      </Button>
    </div>
  );
};
