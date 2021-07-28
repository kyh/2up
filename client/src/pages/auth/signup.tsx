import { SEO } from "components";
import { Auth } from "features/auth/Auth";

const SignupPage = () => {
  return (
    <>
      <SEO title="Sign Up" />
      <Auth />
    </>
  );
};

export default SignupPage;
