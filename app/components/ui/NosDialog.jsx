"use client"

import React, { useState } from "react";
import clsx from "clsx";

import CornerShapes from "./Corners";
import NosBtn from "./NosBtn";

export default function Dialog({
  type,
  label,
  alert,
  onConfirm,
  block,
  rounded,
  ...props
}) {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const typeClassMap = {
    normal: "text-dark bg-light ",
    dark: "text-light bg-dark",
  };

  var classes = typeClassMap[type] || typeClassMap.normal;

  const borders = {
    normal: "border-4 border-dark ",
    dark: "border-4 border-light ",
  };

  var bordersclasses = borders[type] || borders.normal;

  return (
    <div>
      <NosBtn type="primary" block={block} onClick={handleOpenDialog}>
        {label}
      </NosBtn>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark bg-opacity-40">
          <div
            className={clsx(
              classes,
              rounded ? `` : bordersclasses,
              ` relative flex flex-col justify-center gap-3 p-7`,
            )}
          >
            <p>Dialog</p>
            <p className="max-w-sm">Alert: {alert}</p>

            <div className="flex justify-center gap-2">
              <NosBtn type="normal" onClick={handleCloseDialog}>
                Cancel
              </NosBtn>

              <NosBtn type="primary" onClick={onConfirm}>
                Confirm
              </NosBtn>
            </div>

            {rounded &&
              (type === "dark" ? (
                <>
                  <CornerShapes type="dark" />
                </>
              ) : (
                <>
                  <CornerShapes type="light" />
                </>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
