import Head from "next/head";
import { PageContainer } from "features/home/components/Page";
import { GameLayout } from "features/game/GameLayout";
import { GameLobby } from "features/game/GameLobby";

const GameLobbySpectatePage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Game Lobby</title>
      </Head>
      <PageContainer justify="start">
        <GameLobby isSpectate />
      </PageContainer>
    </>
  );
};

GameLobbySpectatePage.Layout = GameLayout;

export default GameLobbySpectatePage;
