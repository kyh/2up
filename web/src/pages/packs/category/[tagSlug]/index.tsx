import { ReactNode } from "react";
import { SEO } from "components";
import { PackLayout } from "lib/packs/PackLayout";
import { PackCategory } from "lib/packs/PackCategory";

const PackCategoryPage = () => {
  return (
    <>
      <SEO title="Pack Category" />
      <PackCategory />
    </>
  );
};

const getLayout = (page: ReactNode) => <PackLayout>{page}</PackLayout>;

PackCategoryPage.getLayout = getLayout;

export default PackCategoryPage;
