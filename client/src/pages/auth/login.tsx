import { SEO } from "components";
import { Auth } from "features/auth/Auth";

const LoginPage = () => {
  return (
    <>
      <SEO title="Login" />
      <Auth isLogin />
    </>
  );
};

export default LoginPage;
