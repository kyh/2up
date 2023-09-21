import { ReactNode } from "react";
import { SEO } from "~/components";
// import { HomeLayout } from "~/lib/home/HomeLayout";

import { JoinGame } from "./joingame";
const HomePage = () => {
  return (
    <>
      <SEO />
      <JoinGame />
    </>
  );
};

// const getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;

// HomePage.getLayout = getLayout;

export default HomePage;
