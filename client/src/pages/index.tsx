import { ReactNode } from "react";
import { SEO } from "components";
import { HomeLayout } from "features/home/HomeLayout";
import { HomeJoinGame } from "features/home/HomeJoinGame";

const HomePage = () => {
  return (
    <>
      <SEO />
      <HomeJoinGame />
    </>
  );
};

const getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;

HomePage.getLayout = getLayout;

export default HomePage;
