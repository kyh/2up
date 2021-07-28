import { SEO } from "components";
import { Profile } from "features/profile/Profile";

const ProfilePage = () => {
  return (
    <>
      <SEO title="Profile" />
      <Profile />
    </>
  );
};

export default ProfilePage;
