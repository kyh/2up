import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Button, Modal } from 'components';

const GET_PACKS = gql``;

export const PackModal = ({
  isPackModalOpen = false,
  setIsPackModalOpen = (_isOpen: boolean) => {},
  onSelectPack = (_pack: string) => {}
}) => {
  // const { data } = useQuery();
  const packs: any[] = [];
  return (
    <Modal
      open={isPackModalOpen}
      title="Select a pack"
      onRequestClose={() => setIsPackModalOpen(false)}
      maxWidth={300}
      closeButton
    >
      <PackModalBody>
        {packs.map(pack => (
          <Button key={pack} fullWidth onClick={() => onSelectPack(pack)}>
            {pack}
          </Button>
        ))}
      </PackModalBody>
    </Modal>
  );
};

const PackModalBody = styled.div`
  min-height: 180px;
`;
