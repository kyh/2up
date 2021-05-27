import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useAlert } from "react-alert";
import ReactTooltip from "react-tooltip";
import { theme } from "styles/theme";
import { useHostGame } from "features/game/gameService";
import { NavigationContainer } from "features/packs/components/Navigation";
import { PackForm } from "features/packs/components/PackForm";
import { Button, Icon, Modal, Loader } from "components";

import { TopbarPackFragment } from "./__generated__/TopbarPackFragment";
import { TopbarPackUpdateMutation } from "./__generated__/TopbarPackUpdateMutation";

type Props = {
  pack: TopbarPackFragment;
  saving: boolean;
  setSaving: (saving: boolean) => void;
};

export const Topbar = ({ pack, saving, setSaving }: Props) => {
  const alert = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [packUpdate] = useMutation<TopbarPackUpdateMutation>(PACK_UPDATE);
  const hostGame = useHostGame();

  const onSaveChanges = async (newPack: TopbarPackFragment) => {
    setSaving(true);
    try {
      await packUpdate({
        variables: {
          input: {
            id: newPack.id,
            name: newPack.name,
            description: newPack.description,
            is_random: newPack.isRandom,
            length: newPack.length,
          },
        },
      });
      setSaving(false);
      setIsOpen(false);
    } catch (error) {
      alert.show(error.message);
      setSaving(false);
    }
  };

  return (
    <StyledNavigationContainer>
      <div className="left">
        <Link to={`/packs/${pack.id}`}>
          <img className="logo" src="/logo/logomark.svg" alt="Playhouse" />
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
          <ReactTooltip effect="solid" place="bottom" />
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
            onClick={() => hostGame(pack.id)}
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
          defaultValues={pack}
        />
      </Modal>
    </StyledNavigationContainer>
  );
};

Topbar.fragments = {
  pack: gql`
    fragment TopbarPackFragment on Pack {
      id
      name
      description
      length
      isRandom
    }
  `,
};

const PACK_UPDATE = gql`
  mutation TopbarPackUpdateMutation($input: PackUpdateInput!) {
    packUpdate(input: $input) {
      pack {
        ...TopbarPackFragment
      }
    }
  }
  ${Topbar.fragments.pack}
`;

const StyledNavigationContainer = styled(NavigationContainer)`
  .left {
    ${theme.breakpoints.desktop} {
      border-right-color: ${theme.ui.backgroundInverse};
    }
  }
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
