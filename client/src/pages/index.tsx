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

HomePage.Layout = HomeLayout;

export default HomePage;
