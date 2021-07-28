import Head from "next/head";
import { PageContainer } from "features/home/components/Page";
import { GameLayout } from "features/game/GameLayout";
import { GameLobby } from "features/game/GameLobby";

const GameLobbyPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Game Lobby</title>
      </Head>
      <PageContainer justify="start">
        <GameLobby />
      </PageContainer>
    </>
  );
};

GameLobbyPage.Layout = GameLayout;

export default GameLobbyPage;
