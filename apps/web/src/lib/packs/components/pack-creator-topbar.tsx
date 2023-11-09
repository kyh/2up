import { useState } from "react";
import {
  Link,
  Button,
  Icon,
  Modal,
  Loader,
  useAlert,
  WithTip,
} from "@/components";
import { NavigationContainer } from "@/lib/packs/components/navigation";
import { PackForm, PackFormInputs } from "@/lib/packs/components/pack-form";
import { usePackStore } from "@/lib/packs/pack-store";
import { useUpdatePack } from "@/lib/packs/use-pack-actions";
import { getErrorMessage } from "@/lib/utils/error";
import { Pack as PackModel, PackTag as PackTagModel } from "@prisma/client";

type Props = {
  pack: PackModel & { tags: PackTagModel[] };
  testPlay: () => void;
};

export const Topbar = ({ pack, testPlay }: Props) => {
  const alert = useAlert();
  const savingScene = usePackStore((state) => state.savingScene);
  const setSavingScene = usePackStore((state) => state.setSavingScene);
  const [isOpen, setIsOpen] = useState(false);
  const { updatePack } = useUpdatePack();

  const onSaveChanges = async (newPack: PackFormInputs) => {
    setSavingScene(true);
    try {
      await updatePack(pack.id, newPack);
      setSavingScene(false);
      setIsOpen(false);
    } catch (error) {
      setSavingScene(false);
      alert.show(getErrorMessage(error));
    }
  };

  return (
    <NavigationContainer variant="grid">
      {/* Left */}
      <div className="col-span-1 w-fit self-center pl-3">
        <Link href={`/packs/${pack.id}`}>
          <picture>
            <source srcSet="/logo/logomark.svg" />
            <img
              className="logo"
              src="/logo/logomark.svg"
              alt="2up"
              height="35"
              width="35"
            />
          </picture>
        </Link>
      </div>
      {/* right */}
      <div className="relative col-span-3 col-start-2 flex w-full items-center justify-between px-3">
        <div>
          <Loader
            className="absolute left-4 top-4 text-grey dark:text-grey-light"
            loading={savingScene}
          />
        </div>
        <button type="button" onClick={() => setIsOpen(true)}>
          <h4 className="m-0 font-bold">{pack?.name}</h4>
        </button>
        {/* right-actions */}
        <div className="flex">
          <WithTip tipContent="Edit pack">
            {/* pack-ext-button */}
            <Button
              className="rounded-full !p-0.5"
              variant="fab"
              onClick={() => setIsOpen(true)}
            >
              <Icon icon="pencil" />
            </Button>
          </WithTip>
          <WithTip tipContent="Test play">
            <Button
              className="rounded-full !p-0.5"
              variant="fab"
              onClick={testPlay}
            >
              <Icon icon="play" />
            </Button>
          </WithTip>
        </div>
      </div>
      <Modal
        open={isOpen}
        title="Pack Settings"
        onClose={() => setIsOpen(false)}
        maxWidth={500}
        closeButton
      >
        <PackForm
          onSubmit={onSaveChanges}
          loading={savingScene}
          submitText="Save Changes"
          defaultValues={{
            name: pack.name,
            description: pack.description || "",
            gameLength: pack.gameLength || 10,
            isRandom: !!pack.isRandom,
            tags: pack.tags.map((t) => t.name) || [],
          }}
        />
      </Modal>
    </NavigationContainer>
  );
};
