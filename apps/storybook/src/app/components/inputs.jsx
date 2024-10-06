import React from "react";
import { Input } from "@2up/ui/ui/input";

export default function Inputs() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Inputs
      </span>

      <Input variant="normal" type="text" name="name" label="Your Name" />
      <Input
        variant="success"
        type="text"
        name="name"
        placeholder="Best.css"
        label=".input.is-success"
        isInline
      />
      <Input
        variant="warning"
        type="text"
        name="name"
        placeholder="8bit.css"
        label=".input.is-warning"
        isInline
      />
      <Input
        variant="error"
        type="text"
        name="name"
        placeholder="awesome.css"
        label=".input.is-error"
        isInline
      />
      <Input
        variant="dark"
        type="text"
        name="name"
        placeholder="dark.css"
        label=".input.is-dark"
        isInline
      />
    </div>
  );
}
