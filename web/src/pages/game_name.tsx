import { ReactNode } from "react";
import { SEO } from "components";
import { HomeLayout } from "lib/home/HomeLayout";
import { HomeSetName } from "lib/home/HomeSetName";

const SetNamePage = () => {
  return (
    <>
      <SEO title="Join Game" />
      <HomeSetName />
    </>
  );
};

const getLayout = (page: ReactNode) => <HomeLayout>{page}</HomeLayout>;

SetNamePage.getLayout = getLayout;

export default SetNamePage;
