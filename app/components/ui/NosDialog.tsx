"use client";

import React, { useState } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import CornerShapes from "./Corners";
import { NosBtn } from "./NosBtn";

const dialogStyles = cva(
  "bg-background fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
  {
    variants: {
      variant: {
        normal: "bg-light text-dark",
        dark: "bg-dark text-light",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

const dialogBorderStyles = cva("border-4", {
  variants: {
    variant: {
      normal: "border-dark",
      dark: "border-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

type DialogProps = VariantProps<typeof dialogStyles> &
  React.HTMLAttributes<HTMLUListElement> & {
    label: string;
    alert: string;
    title?: string;
    block?: boolean;
    rounded?: boolean;
    onConfirm: () => void;
  };

export const Dialog = ({
  variant,
  label,
  alert,
  title,
  onConfirm,
  block,
  rounded,
}: DialogProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const classes = dialogStyles({ variant });
  const borderClasses = dialogBorderStyles({ variant });

  const handleOpenDialog = () => setDialogOpen(true);

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <RadixDialog.Root open={isDialogOpen} onOpenChange={setDialogOpen}>
      <RadixDialog.Trigger asChild>
        <div>
          <NosBtn variant="primary" block={block} onClick={handleOpenDialog}>
            {label}
          </NosBtn>
        </div>
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-dark bg-opacity-40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content
          className={clsx(classes, rounded || borderClasses)}
        >
          {rounded &&
            (variant === "dark" ? (
              <CornerShapes type="dark" />
            ) : (
              <CornerShapes type="normal" />
            ))}
          <RadixDialog.Title className="DialogTitle">
            <p className="text-lg">{title ?? "Dialog"}</p>
          </RadixDialog.Title>
          <RadixDialog.Description className="DialogDescription">
            <p className="max-w-sm text-base">Alert: {alert}</p>
          </RadixDialog.Description>
          <div
            style={{
              display: "flex",
              marginTop: 25,
              justifyContent: "flex-end",
            }}
          >
            <div className="flex justify-center gap-2">
              <NosBtn variant="normal" onClick={handleCloseDialog}>
                Cancel
              </NosBtn>

              <NosBtn variant="primary" onClick={onConfirm}>
                Confirm
              </NosBtn>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
