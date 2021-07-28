import Head from "next/head";
import { PackCreator } from "features/packs/PackCreator";

const PackCreatorPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Pack</title>
      </Head>
      <PackCreator />
    </>
  );
};

export default PackCreatorPage;
