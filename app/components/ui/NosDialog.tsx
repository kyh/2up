"use client";

import React, { useState } from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import CornerShapes from "./Corners";
import { NosBtn } from "./NosBtn";

const dialogStyles = cva("relative flex flex-col justify-center gap-3 p-7", {
  variants: {
    variant: {
      normal: "bg-light text-dark",
      dark: "bg-dark text-light",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

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
    block?: boolean;
    rounded?: boolean;
    onConfirm: () => void;
  };

export const Dialog = ({
  variant,
  label,
  alert,
  onConfirm,
  block,
  rounded,
}: DialogProps) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const classes = dialogStyles({ variant });
  const borderClasses = dialogBorderStyles({ variant });

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <NosBtn variant="primary" block={block} onClick={handleOpenDialog}>
        {label}
      </NosBtn>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark bg-opacity-40">
          <div className={clsx(classes, rounded || borderClasses)}>
            <p>Dialog</p>
            <p className="max-w-sm">Alert: {alert}</p>

            <div className="flex justify-center gap-2">
              <NosBtn variant="normal" onClick={handleCloseDialog}>
                Cancel
              </NosBtn>

              <NosBtn variant="primary" onClick={onConfirm}>
                Confirm
              </NosBtn>
            </div>

            {rounded &&
              (variant === "dark" ? (
                <CornerShapes type="dark" />
              ) : (
                <CornerShapes type="normal" />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
