import React from "react";
import styled from "styled-components";
import graphql from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay/hooks";
import { Button, Modal } from "components";
import { PackModalPlaysQuery } from "./__generated__/PackModalPlaysQuery.graphql";

const PlaysQuery = graphql`
  query PackModalPlaysQuery {
    plays
  }
`;

export const PackModal = ({
  isPackModalOpen = false,
  isLoading = false,
  setIsPackModalOpen = (_isOpen: boolean) => {},
  onSelectPack = (_pack: string) => {},
}) => {
  const data = useLazyLoadQuery<PackModalPlaysQuery>(PlaysQuery, {});

  return (
    <Modal
      open={isPackModalOpen}
      title="Select a pack"
      onRequestClose={() => setIsPackModalOpen(false)}
      maxWidth={300}
      closeButton
    >
      <PackModalBody>
        {data?.plays?.map((play) => {
          if (!play) {
            return null;
          }
          return (
            <Button
              key={play}
              fullWidth
              disabled={isLoading}
              onClick={() => onSelectPack(play)}
            >
              {play}
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
