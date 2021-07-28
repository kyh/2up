import Head from "next/head";
import { PackDetails } from "features/packs/PackDetails";

const PackDetailsPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Pack</title>
      </Head>
      <PackDetails />
    </>
  );
};

export default PackDetailsPage;
