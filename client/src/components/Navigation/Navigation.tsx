import React, { useState } from "react";
import styled from "styled-components";

import { playhouseActions, usePlayhouse } from "features/home/playhouseSlice";

import { Box } from "reflexbox";
import { Icon } from "components/Icon/Icon";
import { Modal } from "components/Modal/Modal";
import { Button, ButtonLink } from "components/Button/Button";

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    state: { isMusicOn, isSFXOn, isDarkMode },
    dispatch,
  } = usePlayhouse();

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
          <Button
            onClick={() => dispatch(playhouseActions.toggle_dark_mode())}
            fullWidth
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </Box>
        <SettingsContainer>
          <SettingItem>
            <span>Game music</span>
            <Button
              fullWidth
              onClick={() => dispatch(playhouseActions.toggle_music())}
            >
              {isMusicOn ? "ON" : "OFF"}
            </Button>
          </SettingItem>
          <SettingItem>
            <span>SFX</span>
            <Button
              fullWidth
              onClick={() => dispatch(playhouseActions.toggle_SFX())}
            >
              {isSFXOn ? "ON" : "OFF"}
            </Button>
          </SettingItem>
        </SettingsContainer>
        <h3>Contact us</h3>
        <SettingsContainer>
          <SettingItem>
            <ButtonLink
              fullWidth
              href="https://github.com/tehkaiyu/playhouse"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </ButtonLink>
          </SettingItem>
          <SettingItem>
            <ButtonLink
              fullWidth
              href="https://join.slack.com/t/playhouse-gg/shared_invite/zt-cmze8pmv-g7Z1ceutMlfLri2hfwo~5A"
              target="_blank"
              rel="noopener noreferrer"
            >
              Slack
            </ButtonLink>
          </SettingItem>
        </SettingsContainer>
      </Modal>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  padding: 0 ${({ theme }) => theme.spacings(3)};
  align-items: center;
  height: 50px;
  right: 0;
  z-index: 1;
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
