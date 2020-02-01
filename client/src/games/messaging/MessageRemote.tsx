import React from 'react';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';

export const MessageRemote = () => {
  return (
    <>
      <MessageList />
      <MessageInput />
    </>
  );
};
