import React from "react";

import NosInput from "./ui/NosInput";

export default function Inputs() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Inputs
      </span>

      <NosInput theme="normal" type="text" name="name" label="Your Name" />
      <NosInput
        theme="success"
        type="text"
        name="name"
        placeholder="Best.css"
        label=".input.is- success"
        isinline
      />
      <NosInput
        theme="warning"
        type="text"
        name="name"
        placeholder="8bit.css"
        label=".input.is- warning"
        isinline
      />
      <NosInput
        theme="error"
        type="text"
        name="name"
        placeholder="awesome.css"
        label=".input.is- error"
        isinline
      />
      <NosInput
        theme="dark"
        type="text"
        name="name"
        placeholder="dark.css"
        label=".input.is- dark"
        isinline
      />
    </div>
  );
}
