import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { classed } from "@/lib/utils/classed";
import { Button } from "@/components/button/button";
import { Icon } from "@/components/icon/icon";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  closeButton?: boolean;
  maxWidth?: number;
  children?: React.ReactNode;
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
    <Transition appear as={Fragment} show={open}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* backdroop */}
          <div className="fixed inset-0 bg-[#000]/30" />
        </Transition.Child>

        {/* panel-fixed-container */}
        <div className="fixed inset-0 overflow-y-auto">
          {/* panel-container */}
          <div className="flex min-h-full justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="absolute left-5 right-5 top-10 mx-auto flex max-w-[600px] flex-col rounded-wavy border-2 border-black bg-grey-dark outline-none dark:border-white"
                style={{ maxWidth }}
              >
                {closeButton ? (
                  <CloseButton onClick={onClose} variant="fab">
                    <Icon icon="close" />
                  </CloseButton>
                ) : null}
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

const CloseButton = classed(
  Button,
  "absolute -right-5 -top-5 rounded-full bg-white dark:bg-black",
);

const ModalHeader = classed.header(
  "flex justify-center items-center text-[1.1rem] text-white p-3",
  "[text-shadow:-1px_1px_0_#1a1919,_1px_1px_0_#1a1919,_1px_-1px_0_#1a1919,_-1px_-1px_0_#1a1919]",
);

const ModalBody = classed.section(
  "h-full max-h-[550px] bg-white dark:bg-black border-2 border-black dark:border-white",
  "p-3 mx-3 mb-3 rounded-wavy overflow-auto",
);
