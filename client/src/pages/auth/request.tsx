import Head from "next/head";
import { Request } from "features/auth/Request";

const RequestPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Sign up</title>
      </Head>
      <Request />
    </>
  );
};

export default RequestPage;
