import { SEO } from "components";
import { PackCategory } from "features/packs/PackCategory";

const PackCategoryPage = () => {
  return (
    <>
      <SEO title="Pack Category" />
      <PackCategory />
    </>
  );
};

export default PackCategoryPage;
