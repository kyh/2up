import React, { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";

import { Box, Button, Icon, Modal } from "components";

import { NavigationPackFragment } from "./__generated__/NavigationPackFragment";
import { NavigationPackUpdateMutation } from "./__generated__/NavigationPackUpdateMutation";
import { NavigationCurrentUserQuery } from "./__generated__/NavigationCurrentUserQuery";

type Props = {
  pack?: NavigationPackFragment;
};

export const Navigation = ({ pack }: Props) => {
  const [editablePack, setEditablePack] = useState(pack);
  const [isOpen, setIsOpen] = useState(false);
  const editMatch = useRouteMatch<{ packId: string }>(
    "/gamemaster/:packId/edit"
  );
  const { data } = useQuery<NavigationCurrentUserQuery>(CURRENT_USER);
  const [packUpdate] = useMutation<NavigationPackUpdateMutation>(PACK_UPDATE);

  useEffect(() => {
    setEditablePack(pack);
  }, [pack]);

  const onChange = (newPackInfo: any, save?: boolean) => {
    const newPack = { ...editablePack, ...newPackInfo };
    setEditablePack(newPack);
    if (save) onSaveChanges();
  };

  const onSaveChanges = async () => {
    if (!editablePack) {
      return;
    }

    await packUpdate({
      variables: {
        input: {
          id: editablePack.id,
          name: editablePack.name,
          is_random: editablePack.isRandom,
          length: editablePack.length,
        },
      },
    });
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <NavigationContainer editMatch={!!editMatch}>
      <div className="left">
        <Link to="/gamemaster">
          <img className="logo" src="/logo/logomark.svg" alt="Playhouse" />
        </Link>
      </div>
      {!!editMatch ? (
        <>
          <div className="right">
            <div className="more">
              <Button variant="fab" onClick={() => setIsOpen(true)}>
                <Icon icon="pencil" />
              </Button>
            </div>
            <input
              className="pack-title"
              defaultValue={pack?.name}
              onChange={(event) => onChange({ name: event.target.value })}
              onBlur={onSaveChanges}
            />
            <div className="empty" />
          </div>
          <Modal
            open={isOpen}
            title="Pack Settings"
            onRequestClose={() => {
              setIsOpen(false);
              onSaveChanges();
            }}
            maxWidth={300}
            closeButton
          >
            <Box mb={3}>
              <h3>Shuffle questions when playing this pack</h3>
              <Button
                onClick={() => onChange({ isRandom: !editablePack?.isRandom })}
                fullWidth
              >
                {editablePack?.isRandom ? "Yes" : "No"}
              </Button>
            </Box>
            <Box>
              <h3>Number of questions to go through</h3>
              <Button
                onClick={() => {
                  if (editablePack?.length) {
                    const newLength =
                      editablePack?.length > 10 ? 5 : editablePack?.length + 5;
                    onChange({ length: newLength });
                  }
                }}
                fullWidth
              >
                {editablePack?.length}
              </Button>
            </Box>
          </Modal>
        </>
      ) : (
        <div className="right end">
          {data?.currentUser?.username ? (
            <>
              <Link to={`/${data?.currentUser?.username}`}>Profile</Link>
              <Link to="/gamemaster" onClick={onLogout}>
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
      )}
    </NavigationContainer>
  );
};

Navigation.fragments = {
  pack: gql`
    fragment NavigationPackFragment on Pack {
      id
      name
      length
      isRandom
    }
  `,
};

const CURRENT_USER = gql`
  query NavigationCurrentUserQuery {
    currentUser {
      username
    }
  }
`;

const PACK_UPDATE = gql`
  mutation NavigationPackUpdateMutation($input: PackUpdateInput!) {
    packUpdate(input: $input) {
      pack {
        ...NavigationPackFragment
      }
    }
  }
  ${Navigation.fragments.pack}
`;

export const NavigationContainer = styled.header<{ editMatch: boolean }>`
  display: flex;
  grid-area: header;
  background: ${({ theme }) => theme.ui.background};
  border-bottom: 1px solid ${({ theme }) => theme.ui.backgroundInverse};

  .logo {
    height: 35px;
  }

  .left {
    display: flex;
    align-items: center;
    width: 345px;
    border-right: 1px solid
      ${({ theme, editMatch }) =>
        editMatch ? theme.ui.backgroundInverse : "transparent"};
    padding-left: ${({ theme }) => theme.spacings(3)};
  }

  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: auto;
    padding: 0 ${({ theme }) => theme.spacings(3)};

    &.end {
      justify-content: flex-end;
      > a {
        padding: ${({ theme }) => theme.spacings(3)};
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .pack-title {
    text-align: center;
    border-radius: ${({ theme }) => theme.border.wavyRadius};
    border: none;
    transition: all 0.23s ease;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
    }
  }
`;
