import { HomeLayout } from "@/lib/home/home-layout";
import { HomeJoinGame } from "@/lib/home/home-join-game";

const HomePage = () => {
  return <HomeJoinGame />;
};

const getLayout = (page: React.ReactNode) => <HomeLayout>{page}</HomeLayout>;

HomePage.getLayout = getLayout;

export default HomePage;
