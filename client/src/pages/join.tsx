import { SEO } from "components";
import { HomeLayout } from "features/home/HomeLayout";
import { HomeSetName } from "features/home/HomeSetName";

const SetNamePage = () => {
  return (
    <>
      <SEO title="Join Game" />
      <HomeSetName />
    </>
  );
};

SetNamePage.Layout = HomeLayout;

export default SetNamePage;
