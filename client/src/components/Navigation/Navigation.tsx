import React, { useState } from 'react';
import styled from 'styled-components';

import { playhouseActions } from 'features/home/playhouseSlice';
import { usePlayhouseChannel } from 'features/home/PlayhouseChannel';

import { Box } from 'reflexbox';
import { Icon } from 'components/Icon/Icon';
import { Modal } from 'components/Modal/Modal';
import { Button } from 'components/Button/Button';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = usePlayhouseChannel();
  const { isMusicOn, isSFXOn } = state;

  return (
    <StyledNav>
      <Button variant="fab" onClick={() => setIsOpen(true)}>
        <Icon icon="setting" />
      </Button>
      <Modal
        open={isOpen}
        title="Settings"
        onRequestClose={() => setIsOpen(false)}
        maxWidth={300}
        closeButton
      >
        <Box mb={2}>
          <Button fullWidth>Login</Button>
        </Box>
        <SettingsContainer>
          <SettingItem>
            <span>Game music</span>
            <Button
              fullWidth
              onClick={() => dispatch(playhouseActions.toggle_music())}
            >
              {isMusicOn ? 'ON' : 'OFF'}
            </Button>
          </SettingItem>
          <SettingItem>
            <span>SFX</span>
            <Button
              fullWidth
              onClick={() => dispatch(playhouseActions.toggle_SFX())}
            >
              {isSFXOn ? 'ON' : 'OFF'}
            </Button>
          </SettingItem>
        </SettingsContainer>
        <h3>Support</h3>
        <SettingsContainer>
          <SettingItem>
            <Button fullWidth>FAQ</Button>
          </SettingItem>
          <SettingItem>
            <Button fullWidth>Contact Us</Button>
          </SettingItem>
        </SettingsContainer>
      </Modal>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 0 ${({ theme }) => theme.spacings(1)};
  align-items: center;
  height: 50px;
`;

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-bottom: ${({ theme }) => theme.spacings(2)};
  margin-bottom: ${({ theme }) => theme.spacings(2)};
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};
  &:last-child {
    border-bottom: none;
  }
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacings(1)};
  }
`;
