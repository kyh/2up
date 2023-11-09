import { SEO } from "@/components";
import { PackLayout } from "@/lib/packs/pack-layout";
import { PackDiscover } from "@/lib/packs/pack-discover";

const PackDiscoverPage = () => {
  return (
    <>
      <SEO title="Discover Packs" />
      <PackDiscover />
    </>
  );
};

const getLayout = (page: React.ReactNode) => (
  <PackLayout bgImage bgTop="100px">
    {page}
  </PackLayout>
);

PackDiscoverPage.getLayout = getLayout;

export default PackDiscoverPage;
