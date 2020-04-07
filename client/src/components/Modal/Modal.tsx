import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import ReactModal from "react-modal";
import { Button } from "components/Button/Button";
import { Icon } from "components/Icon/Icon";

type Props = React.PropsWithChildren<{
  open: boolean;
  onRequestClose: () => void;
  title?: React.ReactNode;
  closeButton?: boolean;
  maxWidth?: number;
}>;

const ModalStyle = createGlobalStyle`
  .modal {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 40px;
    left: 20px;
    right: 20px;
    border: 2px solid ${({ theme }) => theme.ui.modal.border};
    max-width: 600px;
    background: ${({ theme }) => theme.colors.darkGrey};
    border-radius: ${({ theme }) => theme.border.wavyRadius};
    outline: none;
    margin: 0 auto;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export const Modal: React.FC<Props> = ({
  children,
  open,
  closeButton,
  title,
  onRequestClose,
  maxWidth,
}) => {
  return (
    <>
      <ModalStyle />
      <ReactModal
        isOpen={open}
        onRequestClose={onRequestClose}
        className="modal"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        style={{
          content: {
            maxWidth: maxWidth,
          },
        }}
      >
        {closeButton && (
          <CloseButton variant="fab" onClick={onRequestClose}>
            <Icon icon="close" />
          </CloseButton>
        )}
        {title && <ModalHeader>{title}</ModalHeader>}
        <ModalBody>{children}</ModalBody>
      </ReactModal>
    </>
  );
};

const CloseButton = styled(Button)`
  position: absolute;
  right: -20px;
  top: -20px;
  background-color: ${({ theme }) => theme.ui.modal.background};
  border-radius: 100%;
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.h3.fontSize};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacings(3)};
  text-shadow: -1px 1px 0 #1a1919, 1px 1px 0 #1a1919, 1px -1px 0 #1a1919,
    -1px -1px 0 #1a1919;
`;

const ModalBody = styled.section`
  height: 100%;
  max-height: 550px;
  background: ${({ theme }) => theme.ui.modal.background};
  border: 2px solid ${({ theme }) => theme.ui.modal.border};
  padding: ${({ theme }) => theme.spacings(3)};
  margin: 0 ${({ theme }) => `${theme.spacings(3)} ${theme.spacings(3)}`};
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  overflow: auto;
  -webkit-overflow-scroll: touch;
`;
