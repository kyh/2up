import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Input } from 'components';

export const EnterName = ({ onSubmit = (_name: string) => {} }) => {
  const [name, setName] = useState(localStorage.getItem('name') || '');

  const onClickStart = () => {
    localStorage.setItem('name', name);
    onSubmit(name);
  };

  return (
    <EnterNameContainer>
      <Input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button onClick={onClickStart}>Start</Button>
    </EnterNameContainer>
  );
};

const EnterNameContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  input {
    margin-bottom: ${({ theme }) => theme.spacings(1)};
  }
`;
