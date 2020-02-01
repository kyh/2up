import React from 'react';
import { useMessages, MessageType } from 'games/messaging/useMessages';

export const MessageList = () => {
  const [messages] = useMessages();
  console.log(messages);
  return (
    <div>
      {messages.map((message: MessageType, i: number) => {
        return (
          <div key={i}>
            {message.name}: {message.message}
          </div>
        );
      })}
    </div>
  );
};
