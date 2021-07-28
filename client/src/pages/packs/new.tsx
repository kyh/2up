import Head from "next/head";
import { PackNew } from "features/packs/PackNew";

const PackNewPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | New Pack</title>
      </Head>
      <PackNew />
    </>
  );
};

export default PackNewPage;
