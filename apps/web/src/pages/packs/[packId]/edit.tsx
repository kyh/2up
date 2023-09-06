import { SEO } from "~/components";
import { PackCreator } from "~/lib/packs/PackCreator";

const PackCreatorPage = () => {
  return (
    <>
      <SEO title="Edit Pack" />
      <PackCreator />
    </>
  );
};

export default PackCreatorPage;
