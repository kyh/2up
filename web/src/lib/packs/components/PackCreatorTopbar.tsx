import { useState } from "react";
import styled from "styled-components";
import { gql, useMutation } from "~/utils/mock";
import { theme } from "~/styles/theme";
import {
  Link,
  Button,
  Icon,
  Modal,
  Loader,
  useAlert,
  WithTip,
} from "~/components";
import { NavigationContainer } from "~/lib/packs/components/Navigation";
import { PackForm, PackFormInputs } from "~/lib/packs/components/PackForm";
import { usePackStore } from "~/lib/packs/packStore";
import { PACK_FRAGMENT } from "~/lib/packs/packFragments";

type Props = {
  pack: any;
  testPlay: () => void;
};

export const Topbar = ({ pack, testPlay }: Props) => {
  const alert = useAlert();
  const savingScene = usePackStore((state) => state.savingScene);
  const setSavingScene = usePackStore((state) => state.setSavingScene);
  const [isOpen, setIsOpen] = useState(false);
  const [packUpdate] = useMutation(PACK_UPDATE);

  const onSaveChanges = async (newPack: PackFormInputs) => {
    setSavingScene(true);
    try {
      await packUpdate({
        variables: {
          input: {
            id: pack.id,
            ...newPack,
          },
        },
      });
      setSavingScene(false);
      setIsOpen(false);
    } catch (error: any) {
      setSavingScene(false);
      alert.show(error.message);
    }
  };

  return (
    <StyledNavigationContainer>
      <div className="left">
        <Link href={`/packs/${pack.id}`}>
          <img
            className="logo"
            src="/logo/logomark.svg"
            alt="Playhouse"
            height="35"
            width="35"
          />
        </Link>
      </div>
      <div className="right">
        <div>
          <Loader loading={savingScene} />
        </div>
        <button type="button" onClick={() => setIsOpen(true)}>
          <h4 className="pack-title">{pack?.name}</h4>
        </button>
        <div className="right-actions">
          <WithTip tipContent="Edit pack">
            <Button
              className="pack-ext-button"
              variant="fab"
              onClick={() => setIsOpen(true)}
            >
              <Icon icon="pencil" />
            </Button>
          </WithTip>
          <WithTip tipContent="Test play">
            <Button
              className="pack-ext-button"
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
            length: pack.length || 10,
            isRandom: !!pack.isRandom,
            tags: pack.tags || [],
          }}
        />
      </Modal>
    </StyledNavigationContainer>
  );
};

export const PACK_UPDATE = gql`
  mutation PackUpdateMutation($input: PackUpdateInput!) {
    packUpdate(input: $input) {
      pack {
        ...PackFragment
      }
    }
  }
  ${PACK_FRAGMENT}
`;

const StyledNavigationContainer = styled(NavigationContainer)`
  .right {
    position: relative;
  }
  .right-actions {
    display: flex;
  }
  .loader {
    position: absolute;
    left: ${theme.spacings(4)};
    top: ${theme.spacings(4)};
    color: ${theme.ui.textGrey};
  }
  .pack-ext-button {
    margin-right: ${theme.spacings(2)};
  }
  .pack-ext-button:last-child {
    margin-right: 0;
  }
`;
