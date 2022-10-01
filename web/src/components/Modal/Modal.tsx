import { Fragment, ReactNode } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Dialog, Transition } from "@headlessui/react";
import { spacings, theme } from "~/styles/theme";
import { Button } from "~/components/Button/Button";
import { Icon } from "~/components/Icon/Icon";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  closeButton?: boolean;
  maxWidth?: number;
  children?: ReactNode;
};

export const Modal = ({
  children,
  open,
  closeButton,
  title,
  onClose,
  maxWidth,
}: Props) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog className="dialog" as="div" onClose={onClose}>
        <ModalStyle />

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="backdrop" />
        </Transition.Child>

        <div className="panel-fixed-container">
          <div className="panel-container">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="panel" style={{ maxWidth }}>
                {closeButton && (
                  <CloseButton variant="fab" onClick={onClose}>
                    <Icon icon="close" />
                  </CloseButton>
                )}
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>{children}</ModalBody>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const ModalStyle = createGlobalStyle`
  .dialog {
    position: relative;
    z-index: 10;
  }

  .panel-container {
    display: flex;
    min-height: 100%;
    align-items: center;
    justify-content: center;
    padding: ${spacings(4)};
  }

  .panel {
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

  .panel-fixed-container,
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .panel-fixed-container {
    overflow-y: auto;
  }

  .backdrop {
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

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
