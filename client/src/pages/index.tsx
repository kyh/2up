import Head from "next/head";
import { HomeLayout } from "features/home/HomeLayout";
import { HomeJoinGame } from "features/home/HomeJoinGame";

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Playhouse</title>
      </Head>
      <HomeJoinGame />
    </>
  );
};

HomePage.Layout = HomeLayout;

export default HomePage;
