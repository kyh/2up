import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { theme } from "~/styles/theme";
import { useAllHomeStore } from "~/lib/home/homeStore";
import { Icon } from "~/components/Icon/Icon";
import { Modal } from "~/components/Modal/Modal";
import { Button, ButtonLink } from "~/components/Button/Button";
import { createOrGetThemesong } from "~/styles/sound";

export const Navigation = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isDarkMode,
    toggleDarkMode,
    isMusicOn,
    toggleMusic,
    isSFXOn,
    toggleSFX,
  } = useAllHomeStore();

  const { gameId } = router.query;

  const leaveGame = () => {
    router.push("/");
    setIsOpen(false);
  };

  useEffect(() => {
    const themeSong = createOrGetThemesong(isMusicOn);
    isMusicOn ? themeSong.play() : themeSong.pause();
    return () => {
      themeSong.pause();
    };
  }, [isMusicOn]);

  return (
    <NavigationContainer>
      <Button variant="fab" onClick={() => setIsOpen(true)}>
        <Icon icon="setting" />
      </Button>
      <Modal
        open={isOpen}
        title="Settings"
        onClose={() => setIsOpen(false)}
        maxWidth={300}
        closeButton
      >
        {!!gameId && (
          <>
            <SettingsContainer noBorder>
              <SettingItem>
                <span>Game music</span>
                <Button fullWidth onClick={toggleMusic}>
                  {isMusicOn ? "ON" : "OFF"}
                </Button>
              </SettingItem>
              <SettingItem>
                <span>SFX</span>
                <Button fullWidth onClick={toggleSFX}>
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
          <Button onClick={toggleDarkMode} fullWidth>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </SettingsContainer>
        <h3>Find us on</h3>
        <SettingsContainer>
          <SettingItem>
            <ButtonLink
              fullWidth
              href="https://discord.gg/Rt8ygmQ4fk"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </ButtonLink>
          </SettingItem>
          <SettingItem>
            <ButtonLink
              fullWidth
              href="https://github.com/kyh/truffles"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </ButtonLink>
          </SettingItem>
        </SettingsContainer>
      </Modal>
    </NavigationContainer>
  );
};

const NavigationContainer = styled.nav`
  display: flex;
  justify-content: flex-end;
  padding: 0 ${theme.spacings(1)};
  align-items: center;
  height: 50px;
`;

const SettingsContainer = styled.div<{ single?: boolean; noBorder?: boolean }>`
  display: ${({ single }) => (single ? "block" : "grid")};
  grid-template-columns: 1fr 1fr;
  padding-bottom: ${({ noBorder }) => (noBorder ? 0 : theme.spacings(2))};
  margin-bottom: ${theme.spacings(2)};
  border-bottom: ${({ noBorder }) =>
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
    margin-bottom: ${theme.spacings(1)};
  }
`;
