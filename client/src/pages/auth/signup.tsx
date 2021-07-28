import { ReactNode } from "react";
import { SEO } from "components";
import { AuthLayout } from "features/auth/AuthLayout";
import { Auth } from "features/auth/Auth";

const SignupPage = () => {
  return (
    <>
      <SEO title="Sign Up" />
      <Auth />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <AuthLayout bgImg="glasses">{page}</AuthLayout>
);
SignupPage.getLayout = getLayout;

export default SignupPage;
