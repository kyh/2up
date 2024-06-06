import React from "react";

import NosBtn from "./ui/NosBtn";

export default function Buttons() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-2 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Buttons
      </span>

      <NosBtn type="normal">normal</NosBtn>

      <NosBtn type="primary">primary</NosBtn>

      <NosBtn type="success">success</NosBtn>

      <NosBtn type="warning">warning</NosBtn>

      <NosBtn type="error">error</NosBtn>

      <NosBtn type="disabled">disabled</NosBtn>

      <NosBtn type="file">select your file</NosBtn>
    </div>
  );
}
