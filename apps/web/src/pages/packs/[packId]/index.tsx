import { ReactNode } from "react";
import { SEO } from "~/components";
import { PackLayout } from "~/lib/packs/PackLayout";
import { PackDetails } from "~/lib/packs/PackDetails";

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
