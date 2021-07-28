import { SEO } from "components";
import { PackNew } from "features/packs/PackNew";

const PackNewPage = () => {
  return (
    <>
      <SEO title="New Pack" />
      <PackNew />
    </>
  );
};

export default PackNewPage;
