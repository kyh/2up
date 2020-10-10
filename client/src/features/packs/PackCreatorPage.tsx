import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAlert } from "react-alert";

import { useHostGame } from "features/game/gameService";

import { Sidebar } from "features/packs/components/Sidebar";
import { ScenePreview } from "features/packs/components/ScenePreview";
import { NavigationContainer } from "features/packs/components/Navigation";
import { PackForm } from "features/packs/components/PackForm";
import { Button, Icon, Modal, Loader } from "components";

import {
  PackCreatorPagePackQuery,
  PackCreatorPagePackQuery_pack,
} from "./__generated__/PackCreatorPagePackQuery";
import { PackUpdateMutation } from "./__generated__/PackUpdateMutation";

export const PACK_FRAGMENT = gql`
  fragment PackSettingsFragment on Pack {
    id
    name
    description
    length
    isRandom
  }
`;

const PACK_UPDATE = gql`
  mutation PackUpdateMutation($input: PackUpdateInput!) {
    packUpdate(input: $input) {
      pack {
        ...PackSettingsFragment
      }
    }
  }
  ${PACK_FRAGMENT}
`;

export const Navigation = ({
  pack,
  saving,
  setSaving,
}: {
  pack: PackCreatorPagePackQuery_pack;
  saving: boolean;
  setSaving: (saving: boolean) => void;
}) => {
  const alert = useAlert();
  const [isOpen, setIsOpen] = useState(false);
  const [packUpdate] = useMutation<PackUpdateMutation>(PACK_UPDATE);
  const hostGame = useHostGame();

  const onSaveChanges = async (newPackInfo = {}) => {
    setSaving(true);
    const newPack = { ...pack, ...newPackInfo };
    try {
      await packUpdate({
        variables: {
          input: {
            id: newPack.id,
            name: newPack.name,
            is_random: newPack.isRandom,
            length: newPack.length,
          },
        },
      });
      setSaving(false);
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
        <input
          className="pack-title"
          defaultValue={pack?.name}
          onBlur={(e) => onSaveChanges({ name: e.target.value })}
        />
        <div>
          <Button
            className="pack-ext-button"
            variant="fab"
            onClick={() => setIsOpen(true)}
          >
            <Icon icon="pencil" />
          </Button>
          <Button
            className="pack-ext-button"
            variant="fab"
            onClick={() => hostGame(pack.id)}
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

const StyledNavigationContainer = styled(NavigationContainer)`
  .left {
    ${({ theme }) => theme.media.desktop`
      border-right-color: ${theme.ui.backgroundInverse};
    `}
  }
  .right {
    position: relative;
  }
  .loader {
    position: absolute;
    left: ${({ theme }) => theme.spacings(4)};
    top: ${({ theme }) => theme.spacings(4)};
    color: ${({ theme }) => theme.ui.lightText};
  }
  .pack-ext-button {
    margin-right: ${({ theme }) => theme.spacings(2)};
  }
  .pack-ext-button:last-child {
    margin-right: 0;
  }
`;

const PACK_QUERY = gql`
  query PackCreatorPagePackQuery($packId: ID!, $sceneId: ID) {
    pack(id: $packId) {
      ...PackSettingsFragment
      ...SidebarPackFragment
    }
    act(id: $sceneId, packId: $packId) {
      ...ScenePreviewFragment
    }
    questionTypes {
      id
      slug
    }
    answerTypes {
      id
      slug
    }
  }
  ${PACK_FRAGMENT}
  ${Sidebar.fragments.pack}
  ${ScenePreview.fragments.act}
`;

export const PackCreatorPage = () => {
  const [saving, setSaving] = useState(false);
  const { packId } = useParams<{ packId: string }>();
  const { data, refetch } = useQuery<PackCreatorPagePackQuery>(PACK_QUERY, {
    variables: {
      packId: packId || "",
    },
  });

  const selectScene = (selectedSceneId: string) => {
    const newVariables = {
      packId,
      sceneId: selectedSceneId,
    };
    refetch(newVariables);
  };

  return (
    <Page>
      {data?.pack && (
        <>
          <Navigation pack={data.pack} saving={saving} setSaving={setSaving} />
          <Sidebar
            pack={data.pack}
            selectedSceneId={data.act?.id}
            selectScene={selectScene}
            refetch={refetch}
            setSaving={setSaving}
          />
        </>
      )}
      <Content>
        {data?.act && <ScenePreview scene={data.act} setSaving={setSaving} />}
      </Content>
    </Page>
  );
};

export const Page = styled.section`
  display: grid;
  height: calc((var(--vh, 1vh) * 100));
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header  header  header"
    "sidebar content content"
    "sidebar  footer  footer";
  grid-template-columns: 345px 1fr 1fr;
  grid-template-rows: 50px 1fr 0;
`;

export const Content = styled.section`
  grid-area: content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacings(5)};
`;

// const Footer = styled.footer`
//   grid-area: footer;
//   display: flex;
//   padding: ${({ theme }) => theme.spacings(4)};
// `;
