import { ReactNode } from "react";
import { SEO } from "components";
import { PackLayout } from "features/packs/PackLayout";
import { PackDetails } from "features/packs/PackDetails";

const PackDetailsPage = () => {
  return (
    <>
      <SEO title="Pack Details" />
      <PackDetails />
    </>
  );
};

const getLayout = (page: ReactNode) => <PackLayout>{page}</PackLayout>;

PackDetailsPage.getLayout = getLayout;

export default PackDetailsPage;
