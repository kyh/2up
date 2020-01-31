import React from 'react';
import { Input, Button } from 'components';

export const RemotePromptScene: React.FC = () => {
  return (
    <div>
      <h2>Who was the 5th president of the United States?</h2>
      <Input />
      <Button>Submit answer</Button>
    </div>
  );
};
