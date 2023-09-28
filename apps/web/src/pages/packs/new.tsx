import { ReactNode } from "react";
import { SEO } from "~/components";
import { PackLayout } from "~/lib/packs/pack-layout";
import { PackNew } from "~/lib/packs/pack-new";

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
