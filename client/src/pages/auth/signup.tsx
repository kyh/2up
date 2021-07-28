import Head from "next/head";
import { Auth } from "features/auth/Auth";

const SignupPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Sign up</title>
      </Head>
      <Auth />
    </>
  );
};

export default SignupPage;
