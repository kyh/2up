import { ReactNode } from "react";
import { SEO } from "~/components";
import { PackLayout } from "~/lib/packs/pack-layout";
import { Profile } from "~/lib/profile/profile";

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
