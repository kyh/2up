import React from 'react';
import { Box, Button, Input } from 'components';
import { useMessages, actions, MessageType } from 'hooks/useMessages';

export const Remote = () => {
  const [state, broadcast] = useMessages();
  const [message, setMessage] = React.useState('');
  const [name, setName] = React.useState('');

  return (
    <div>
      <h2>Remote</h2>
      <div>
        {state.map((message: MessageType, i: number) => {
          return (
            <div key={i}>
              {message.name}: {message.message}
            </div>
          );
        })}
      </div>
      <Box>
        <label>
          Name:
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>
      </Box>
      <Box>
        <label>
          Message:
          <Input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </label>
      </Box>

      <Button
        onClick={() => {
          broadcast(actions.shout, { name, message });
          setMessage('');
        }}
      >
        Shout
      </Button>
    </div>
  );
};
