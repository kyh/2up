import { useState } from "react";
import styled from "styled-components";
import { gql, useMutation, useReactiveVar } from "~/utils/mock";
import { theme } from "~/styles/theme";
import { Link, Button, Icon, Modal, Loader, useAlert } from "~/components";
import { NavigationContainer } from "~/lib/packs/components/Navigation";
import { PackForm, PackFormInputs } from "~/lib/packs/components/PackForm";
import { savingSceneVar } from "~/lib/packs/packService";
import { PACK_FRAGMENT } from "~/lib/packs/packFragments";

type Props = {
  pack: any;
  testPlay: () => void;
};

export const Topbar = ({ pack, testPlay }: Props) => {
  const alert = useAlert();
  const saving = useReactiveVar(savingSceneVar);
  const [isOpen, setIsOpen] = useState(false);
  const [packUpdate] = useMutation(PACK_UPDATE);

  const onSaveChanges = async (newPack: PackFormInputs) => {
    savingSceneVar(true);
    try {
      await packUpdate({
        variables: {
          input: {
            id: pack.id,
            ...newPack,
          },
        },
      });
      savingSceneVar(false);
      setIsOpen(false);
    } catch (error: any) {
      savingSceneVar(false);
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
          <Loader loading={saving} />
        </div>
        <button onClick={() => setIsOpen(true)}>
          <h4 className="pack-title">{pack?.name}</h4>
        </button>
        <div>
          <Button
            className="pack-ext-button"
            variant="fab"
            onClick={() => setIsOpen(true)}
            data-tip="Edit pack"
          >
            <Icon icon="pencil" />
          </Button>
          <Button
            className="pack-ext-button"
            variant="fab"
            onClick={testPlay}
            data-tip="Test play"
          >
            <Icon icon="play" />
          </Button>
        </div>
      </div>
      <Modal
        open={isOpen}
        title="Pack Settings"
        onRequestClose={() => setIsOpen(false)}
        maxWidth={500}
        closeButton
      >
        <PackForm
          onSubmit={onSaveChanges}
          loading={saving}
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
