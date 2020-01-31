import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const MessageContainer = () => {
  return (
    <>
      <MessageList />
      <MessageInput />
    </>
  );
};
