import { Card } from "@/components";
import { Content } from "@/lib/packs/components/page";
import { PackForm, PackFormInputs } from "@/lib/packs/components/pack-form";
import { useCreatePack } from "@/lib/packs/use-pack-actions";

export const PackNew = () => {
  const { createPack, isLoading } = useCreatePack();

  const handlePackForm = async (pack: PackFormInputs) => {
    await createPack(pack);
  };

  return (
    <Content className="mx-auto my-0 block max-w-lg">
      <h1 className="mb-3 text-3xl font-bold">New Pack</h1>
      <Card background>
        <PackForm onSubmit={handlePackForm} loading={isLoading} />
      </Card>
    </Content>
  );
};
