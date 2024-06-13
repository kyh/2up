import React from "react";

import NostalgicTextarea from "./ui/NosTextarea";

export default function NosTextarea() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Textarea
      </span>

      <NostalgicTextarea
        theme="normal"
        id="txt"
        name="name"
        label="Textarea"
        spanVariant="normal"
        inputVariant="normal"
        containerVariant="dark"
      />
    </div>
  );
}
