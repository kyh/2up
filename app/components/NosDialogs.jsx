import React from "react";

import { Dialog } from "./ui/NosDialog";

export default function Dialogs() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Dialogs
      </span>

      <Dialog label="Open dialog" alert="this is a dialog." block />

      <Dialog
        label="Open dark dialog"
        alert="this is a dialog."
        variant="dark"
        block
      />

      <Dialog
        label="Open rounded dialog"
        alert="this is a dialog."
        rounded
        block
      />

      <Dialog
        label="Open dark and rounded dialog"
        alert="this is a dialog."
        variant="dark"
        rounded
        block
      />

      <p className="text-error-hover">
        we dont use any JavaScript library. If you want to use dialog element
        other than Chrome, you need polyfill.
      </p>
    </div>
  );
}
