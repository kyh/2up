import { ReactNode } from "react";
import { SEO } from "~/components";
import { AuthLayout } from "~/lib/auth/AuthLayout";
import { Auth } from "~/lib/auth/Auth";

const LoginPage = () => {
  return (
    <>
      <SEO title="Login" />
      <Auth isLogin />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <AuthLayout bgImage="crown">{page}</AuthLayout>
);

LoginPage.getLayout = getLayout;

export default LoginPage;
