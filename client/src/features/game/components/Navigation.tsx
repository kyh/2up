import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";

import { playhouseActions, usePlayhouse } from "features/home/playhouseSlice";
import { gameActions } from "features/game/gameSlice";

import { Icon } from "components/Icon/Icon";
import { Modal } from "components/Modal/Modal";
import { Button, ButtonLink } from "components/Button/Button";

export const Navigation: React.FC = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const {
    state: { isMusicOn, isSFXOn, isDarkMode },
    dispatch,
  } = usePlayhouse();
  const gameMatch = useRouteMatch<{ gameId: string }>("/game/:gameId");

  const leaveGame = () => {
    dispatch(gameActions.reset());
    history.push("/");
    setIsOpen(false);
  };

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
        {!!gameMatch && (
          <>
            <SettingsContainer noBorder>
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
            <SettingsContainer single>
              <Button onClick={leaveGame} fullWidth>
                Leave Game
              </Button>
            </SettingsContainer>
          </>
        )}
        <h3>Profile</h3>
        <SettingsContainer single>
          <Button
            onClick={() => dispatch(playhouseActions.toggle_dark_mode())}
            fullWidth
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </SettingsContainer>
        <h3>Find us on</h3>
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
              href="https://join.slack.com/t/playhouse-gg/shared_invite/zt-dzouxy28-Z_sP6RrD4Ign1yUV1GEQkw"
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
  display: flex;
  justify-content: flex-end;
  padding: 0 ${({ theme }) => theme.spacings(3)};
  align-items: center;
  height: 50px;
`;

const SettingsContainer = styled.div<{ single?: boolean; noBorder?: boolean }>`
  display: ${({ single }) => (single ? "block" : "grid")};
  grid-template-columns: 1fr 1fr;
  padding-bottom: ${({ theme, noBorder }) =>
    noBorder ? 0 : theme.spacings(2)};
  margin-bottom: ${({ theme }) => theme.spacings(2)};
  border-bottom: ${({ theme, noBorder }) =>
    noBorder ? "none" : `2px solid ${theme.colors.black}`};
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
