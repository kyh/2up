import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { classed } from "~/utils/classed";
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
      <Button
        className="rounded-full"
        variant="fab"
        onClick={() => setIsOpen(true)}
      >
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
                <SettingItemSpan>Game music</SettingItemSpan>
                <Button fullWidth onClick={toggleMusic}>
                  {isMusicOn ? "ON" : "OFF"}
                </Button>
              </SettingItem>
              <SettingItem>
                <SettingItemSpan>SFX</SettingItemSpan>
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
        <h3 className="mb-2">Profile</h3>
        <SettingsContainer single>
          <Button onClick={toggleDarkMode} fullWidth>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </SettingsContainer>
        <h3 className="mb-2">Find us on</h3>
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

const NavigationContainer = classed.nav(
  "flex justify-end items-center px-2 h-[50px]"
);

const SettingsContainer = classed.div("mb-2 last:border-none", {
  variants: {
    single: {
      true: "block",
      false: "grid grid-cols-2 gap-1",
    },
    noBorder: {
      true: "",
      false: "pb-2 border-b-2 border-black",
    },
  },
  defaultVariants: {
    single: "false",
    noBorder: "false",
  },
});

const SettingItem = classed.div("flex flex-col justify-center items-center");

const SettingItemSpan = classed.span("block mb-1");
