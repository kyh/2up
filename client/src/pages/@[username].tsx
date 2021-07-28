import Head from "next/head";
import { Profile } from "features/profile/Profile";

const ProfilePage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Profile</title>
      </Head>
      <Profile />
    </>
  );
};

export default ProfilePage;
