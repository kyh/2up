import { SEO } from "components";
import { Request } from "features/auth/Request";

const RequestPage = () => {
  return (
    <>
      <SEO title="Request Beta" />
      <Request />
    </>
  );
};

export default RequestPage;
