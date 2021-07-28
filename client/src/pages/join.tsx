import Head from "next/head";
import { HomeLayout } from "features/home/HomeLayout";
import { HomeSetName } from "features/home/HomeSetName";

const SetNamePage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Join Game</title>
      </Head>
      <HomeSetName />
    </>
  );
};

SetNamePage.Layout = HomeLayout;

export default SetNamePage;
