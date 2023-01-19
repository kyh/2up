import { ReactNode } from "react";
import { SEO } from "components";
import { AuthLayout } from "lib/auth/AuthLayout";
import { AuthForm } from "lib/auth/AuthForm";

const SignupPage = () => {
  return (
    <>
      <SEO title="Sign Up" />
      <AuthForm />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <AuthLayout bgImage="glasses">{page}</AuthLayout>
);

SignupPage.getLayout = getLayout;

export default SignupPage;
