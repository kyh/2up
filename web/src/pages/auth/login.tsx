import { ReactNode } from "react";
import { SEO } from "~/components";
import { AuthLayout } from "~/lib/auth/AuthLayout";
import { AuthForm } from "~/lib/auth/AuthForm";

const LoginPage = () => {
  return (
    <>
      <SEO title="Login" />
      <AuthForm isLogin />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <AuthLayout bgImage="crown">{page}</AuthLayout>
);

LoginPage.getLayout = getLayout;

export default LoginPage;
