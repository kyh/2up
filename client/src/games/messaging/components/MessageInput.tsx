import React from 'react';
import { Box, Button, Input } from 'components';
import { useMessages, actions } from 'games/messaging/useMessages';

export const MessageInput = () => {
  const [, broadcast] = useMessages();
  const [message, setMessage] = React.useState('');
  const [name, setName] = React.useState('');

  return (
    <div>
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
