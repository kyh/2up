import { ReactNode } from "react";
import { SEO } from "~/components";
import { PackLayout } from "~/lib/packs/PackLayout";
import { Profile } from "~/lib/profile/Profile";

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
