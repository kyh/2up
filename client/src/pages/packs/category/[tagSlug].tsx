import Head from "next/head";
import { PackCategory } from "features/packs/PackCategory";

const PackCategoryPage = () => {
  return (
    <>
      <Head>
        <title>Playhouse | Category</title>
      </Head>
      <PackCategory />
    </>
  );
};

export default PackCategoryPage;
