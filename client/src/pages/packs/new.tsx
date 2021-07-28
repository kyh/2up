import { ReactNode } from "react";
import { SEO } from "components";
import { PackLayout } from "features/packs/PackLayout";
import { PackNew } from "features/packs/PackNew";

const PackNewPage = () => {
  return (
    <>
      <SEO title="New Pack" />
      <PackNew />
    </>
  );
};

const getLayout = (page: ReactNode) => <PackLayout>{page}</PackLayout>;

PackNewPage.getLayout = getLayout;

export default PackNewPage;
