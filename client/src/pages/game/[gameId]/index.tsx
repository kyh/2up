import Head from "next/head";
import { PageContainer } from "features/home/components/Page";
import { GameLayout } from "features/game/GameLayout";
import { Game } from "features/game/Game";

const GamePage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Game</title>
      </Head>
      <PageContainer justify="start">
        <Game />
      </PageContainer>
    </>
  );
};

GamePage.Layout = GameLayout;

export default GamePage;
