import { SEO } from "~/components";
import { PackCreator } from "~/lib/packs/pack-creator";

const PackCreatorPage = () => {
  return (
    <>
      <SEO title="Edit Pack" />
      <PackCreator />
    </>
  );
};

export default PackCreatorPage;
