import { ReactNode } from "react";
import { SEO } from "components";
import { AuthLayout } from "lib/auth/AuthLayout";
import { Request } from "lib/auth/Request";

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
