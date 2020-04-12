import React from "react";
import styled from "styled-components";
import graphql from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay/hooks";
import { Button, Modal } from "components";
import { PackModalPacksQuery } from "./__generated__/PackModalPacksQuery.graphql";

const PacksQuery = graphql`
  query PackModalPacksQuery {
    packs(first: 5) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const PackModal = ({
  isPackModalOpen = false,
  isLoading = false,
  setIsPackModalOpen = (_isOpen: boolean) => {},
  onSelectPack = (_pack: string) => {},
}) => {
  const data = useLazyLoadQuery<PackModalPacksQuery>(PacksQuery, {});

  return (
    <Modal
      open={isPackModalOpen}
      title="Select a pack"
      onRequestClose={() => setIsPackModalOpen(false)}
      maxWidth={300}
      closeButton
    >
      <PackModalBody>
        {data?.packs?.edges?.map((edge) => {
          const pack = edge?.node;
          if (!pack) {
            return null;
          }
          return (
            <Button
              key={pack.id}
              fullWidth
              disabled={isLoading}
              onClick={() => onSelectPack(pack.name)}
            >
              {pack.name}
            </Button>
          );
        })}
      </PackModalBody>
    </Modal>
  );
};

const PackModalBody = styled.div`
  min-height: 180px;
`;
