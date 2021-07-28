import Head from "next/head";
import { PackDiscover } from "features/packs/PackDiscover";

const PackDiscoverPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Discover</title>
      </Head>
      <PackDiscover />
    </>
  );
};

export default PackDiscoverPage;
