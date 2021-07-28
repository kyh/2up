import Head from "next/head";
import { Auth } from "features/auth/Auth";

const LoginPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Login</title>
      </Head>
      <Auth isLogin />
    </>
  );
};

export default LoginPage;
