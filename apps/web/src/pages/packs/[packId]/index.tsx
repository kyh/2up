import { ReactNode } from "react";
import { SEO } from "~/components";
import { PackLayout } from "~/lib/packs/pack-layout";
import { PackDetails } from "~/lib/packs/pack-details";

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
