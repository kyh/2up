import { Fragment, ReactNode } from "react";
import { classed } from "@tw-classed/react";
import { Dialog, Transition } from "@headlessui/react";
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
      <Dialog className="relative z-10" as="div" onClose={onClose}>
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
          <div className="flex min-h-full text-center justify-center p-4">
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
                className="flex flex-col absolute top-10 left-5 right-5 border-2 border-black dark:border-white max-w-[600px] bg-grey-dark rounded-wavy outline-none mx-auto"
                style={{ maxWidth }}
              >
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

const CloseButton = classed(
  Button,
  "absolute -right-5 -top-5 rounded-full bg-white dark:bg-black"
);

const ModalHeader = classed.header(
  "flex justify-center items-center text-[1.1rem] text-white p-3",
  "[text-shadow:-1px_1px_0_#1a1919,_1px_1px_0_#1a1919,_1px_-1px_0_#1a1919,_-1px_-1px_0_#1a1919]"
);

const ModalBody = classed.section(
  "h-full max-h-[550px] bg-white dark:bg-black border-2 border-black dark:border-white",
  "p-3 mx-3 mb-3 rounded-wavy overflow-auto"
);
