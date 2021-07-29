import { ReactNode } from "react";
import { SEO } from "components";
import { PackLayout } from "features/packs/PackLayout";
import { PackDiscover } from "features/packs/PackDiscover";

const PackDiscoverPage = () => {
  return (
    <>
      <SEO title="Discover Packs" />
      <PackDiscover />
    </>
  );
};

const getLayout = (page: ReactNode) => (
  <PackLayout bgImage="/illustrations/space.svg" bgTop="100px">
    {page}
  </PackLayout>
);

PackDiscoverPage.getLayout = getLayout;

export default PackDiscoverPage;
