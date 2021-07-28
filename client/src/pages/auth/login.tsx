import { ReactNode } from "react";
import { SEO } from "components";
import { AuthLayout } from "features/auth/AuthLayout";
import { Auth } from "features/auth/Auth";

const LoginPage = () => {
  return (
    <>
      <SEO title="Login" />
      <Auth isLogin />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <AuthLayout bgImg="crown">{page}</AuthLayout>
);
LoginPage.getLayout = getLayout;

export default LoginPage;
