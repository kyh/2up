import React, { useState } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { useFragment } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";

import { Box, Button, Icon, Modal } from "components";
import { Navigation_pack$key } from "./__generated__/Navigation_pack.graphql";

type Props = {
  pack?: Navigation_pack$key;
};

export const Navigation = ({ pack }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const editMatch = useRouteMatch<{ packId: string }>(
    "/gamemaster/:packId/edit"
  );

  const data = useFragment(
    graphql`
      fragment Navigation_pack on Pack {
        id
        name
      }
    `,
    pack || null
  );

  return (
    <NavigationContainer editMatch={!!editMatch}>
      <div className="left">
        <Link to="/gamemaster">
          <img className="logo" src="/logo/logomark.svg" alt="Playhouse" />
        </Link>
      </div>
      {!!editMatch && (
        <>
          <div className="right">
            <div className="more">
              <Button variant="fab" onClick={() => setIsOpen(true)}>
                <Icon icon="pencil" />
              </Button>
            </div>
            <input className="pack-title" defaultValue={data?.name} />
            <div className="empty" />
          </div>
          <Modal
            open={isOpen}
            title="Pack Settings"
            onRequestClose={() => setIsOpen(false)}
            maxWidth={300}
            closeButton
          >
            <Box mb={3}>
              <h3>Shuffle questions when playing this pack</h3>
              <Button onClick={() => {}} fullWidth>
                Yes
              </Button>
            </Box>
            <Box>
              <h3>Number of questions to go through</h3>
              <Button onClick={() => {}} fullWidth>
                10
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </NavigationContainer>
  );
};

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
