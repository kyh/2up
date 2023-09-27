import { ReactNode } from "react";
import { SEO } from "~/components";
import { JoinGame } from "./joingame";
import { HomeLayoutV2 } from "~/lib/home/HomeLayoutV2";

const HomePage = () => {
  return (
    <>
      <SEO />
      <JoinGame />
    </>
  );
};

const getLayout = (page: ReactNode) => <HomeLayoutV2>{page}</HomeLayoutV2>;

HomePage.getLayout = getLayout;

export default HomePage;
