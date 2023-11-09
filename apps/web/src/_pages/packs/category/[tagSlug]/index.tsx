import { SEO } from "@/components";
import { PackLayout } from "@/lib/packs/pack-layout";
import { PackCategory } from "@/lib/packs/pack-category";

const PackCategoryPage = () => {
  return (
    <>
      <SEO title="Pack Category" />
      <PackCategory />
    </>
  );
};

const getLayout = (page: React.ReactNode) => <PackLayout>{page}</PackLayout>;

PackCategoryPage.getLayout = getLayout;

export default PackCategoryPage;
