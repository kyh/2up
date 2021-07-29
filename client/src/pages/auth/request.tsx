import { ReactNode } from "react";
import { SEO } from "components";
import { AuthLayout } from "features/auth/AuthLayout";
import { Request } from "features/auth/Request";

const RequestPage = () => {
  return (
    <>
      <SEO title="Request Beta" />
      <Request />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <AuthLayout bgImage="glasses">{page}</AuthLayout>
);

RequestPage.getLayout = getLayout;

export default RequestPage;
