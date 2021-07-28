import { SEO } from "components";
import { PackDetails } from "features/packs/PackDetails";

const PackDetailsPage = () => {
  return (
    <>
      <SEO title="Pack Details" />
      <PackDetails />
    </>
  );
};

export default PackDetailsPage;
