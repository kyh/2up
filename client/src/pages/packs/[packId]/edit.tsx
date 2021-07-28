import { SEO } from "components";
import { PackCreator } from "features/packs/PackCreator";

const PackCreatorPage = () => {
  return (
    <>
      <SEO title="Edit Pack" />
      <PackCreator />
    </>
  );
};

export default PackCreatorPage;
