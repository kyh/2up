import { ReactNode } from "react";
import { SEO } from "components";
import { PackLayout } from "features/packs/PackLayout";
import { Profile } from "features/profile/Profile";

const ProfilePage = () => {
  return (
    <>
      <SEO title="Profile" />
      <Profile />
    </>
  );
};

const getLayout = (page: ReactNode) => <PackLayout>{page}</PackLayout>;

ProfilePage.getLayout = getLayout;

export default ProfilePage;
