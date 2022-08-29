import { ReactNode } from "react";
import { SEO } from "components";
import { AuthLayout } from "lib/auth/AuthLayout";
import { Auth } from "lib/auth/Auth";

const SignupPage = () => {
  return (
    <>
      <SEO title="Sign Up" />
      <Auth />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <AuthLayout bgImage="glasses">{page}</AuthLayout>
);

SignupPage.getLayout = getLayout;

export default SignupPage;
