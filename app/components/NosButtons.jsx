import React from "react";

import NosBtn from "./ui/NosBtn";

export default function Buttons() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-2 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Buttons
      </span>

      <NosBtn variant="normal">normal</NosBtn>

      <NosBtn variant="primary">primary</NosBtn>

      <NosBtn variant="success">success</NosBtn>

      <NosBtn variant="warning">warning</NosBtn>

      <NosBtn variant="error">error</NosBtn>

      <NosBtn variant="disabled">disabled</NosBtn>

      <NosBtn variant="file">select your file</NosBtn>
    </div>
  );
}
