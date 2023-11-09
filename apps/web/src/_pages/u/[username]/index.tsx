import { PackLayout } from "@/lib/packs/pack-layout";
import { Profile } from "@/lib/profile/profile";

const ProfilePage = () => {
  return <Profile />;
};

const getLayout = (page: React.ReactNode) => <PackLayout>{page}</PackLayout>;

ProfilePage.getLayout = getLayout;

export default ProfilePage;
