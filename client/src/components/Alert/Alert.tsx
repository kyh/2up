import React from 'react';
import styled from 'styled-components';

const AlertTemplate = styled.div`
  color: ${({ theme }) => theme.ui.alert.text};
  background: ${({ theme }) => theme.ui.alert.background};
  padding: ${({ theme }) => theme.spacings(3)};
  border-radius: 30px 2px 30% 3px / 4px 10px 3px 30px;
  display: flex;
  align-items: flex-start;
`;

export const Alert = styled(AlertTemplate)`
  position: absolute;
  top: ${({ theme }) => theme.spacings(3)};
`;

export const ReactAlertTemplate = ({ style, message, close }: any) => {
  return (
    <AlertTemplate style={style}>
      {message}
      <CloseButton onClick={close}>X</CloseButton>
    </AlertTemplate>
  );
};

const CloseButton = styled.button`
  margin-left: ${({ theme }) => theme.spacings(3)};
`;
