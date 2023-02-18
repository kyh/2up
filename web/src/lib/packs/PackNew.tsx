import { classed } from "@tw-classed/react";
import { Card } from "~/components";
import { Content } from "~/lib/packs/components/Page";
import { PackForm, PackFormInputs } from "~/lib/packs/components/PackForm";
import { useCreatePack } from "~/lib/packs/usePackActions";

export const PackNew = () => {
  const { createPack, isLoading } = useCreatePack();

  const handlePackForm = async (pack: PackFormInputs) => {
    await createPack(pack);
  };

  return (
    <PackNewPageContent>
      <h1 className="title">New Pack</h1>
      <Card background>
        <PackForm onSubmit={handlePackForm} loading={isLoading} />
      </Card>
    </PackNewPageContent>
  );
};

const PackNewPageContent = classed(Content, "block max-w-[500px] my-0 mx-auto");
