import React from "react";

import { Button } from "./ui/button";

export default function Buttons() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-2 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Buttons
      </span>

      <Button variant="normal">normal</Button>

      <Button variant="primary">primary</Button>

      <Button variant="success">success</Button>

      <Button variant="warning">warning</Button>

      <Button variant="error">error</Button>

      <Button variant="disabled">disabled</Button>

      <Button variant="file">select your file</Button>
    </div>
  );
}
