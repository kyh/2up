import { ReactNode } from "react";
import styled, { createGlobalStyle } from "styled-components";
import ReactModal from "react-modal";
import { theme } from "~/styles/theme";
import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";

type Props = {
  open: boolean;
  onRequestClose: () => void;
  title?: ReactNode;
  closeButton?: boolean;
  maxWidth?: number;
  children?: ReactNode;
};

const ModalStyle = createGlobalStyle`
  .modal {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 40px;
    left: 20px;
    right: 20px;
    border: 2px solid ${theme.ui.modalBorder};
    max-width: 600px;
    background: ${theme.colors.greyDark};
    border-radius: ${theme.ui.borderWavyRadius};
    outline: none;
    margin: 0 auto;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

export const Modal = ({
  children,
  open,
  closeButton,
  title,
  onRequestClose,
  maxWidth,
}: Props) => {
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
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ReactModal>
    </>
  );
};

const CloseButton = styled(Button)`
  position: absolute;
  right: -20px;
  top: -20px;
  background-color: ${theme.ui.modalBackground};
  border-radius: 100%;
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  color: ${theme.colors.white};
  padding: ${theme.spacings(3)};
  text-shadow: -1px 1px 0 #1a1919, 1px 1px 0 #1a1919, 1px -1px 0 #1a1919,
    -1px -1px 0 #1a1919;
`;

const ModalBody = styled.section`
  height: 100%;
  max-height: 550px;
  background: ${theme.ui.modalBackground};
  border: 2px solid ${theme.ui.modalBorder};
  padding: ${theme.spacings(3)};
  margin: 0 ${theme.spacings(3)} ${theme.spacings(3)};
  border-radius: ${theme.ui.borderWavyRadius};
  overflow: auto;
  -webkit-overflow-scroll: touch;
`;
