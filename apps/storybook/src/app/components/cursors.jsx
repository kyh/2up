import React from "react";

import { Cursor } from "./ui/cursor";

export default function Cursors() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Cursors
      </span>

      <Cursor type="normal" from="left">
        This is not a clickable element, but it's an area of the pointer.
      </Cursor>
    </div>
  );
}
