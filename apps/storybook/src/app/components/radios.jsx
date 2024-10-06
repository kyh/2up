import React from "react";
import { Radio } from "@2up/ui/ui/radio";

export default function Radios() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Radios
      </span>

      <Radio name="pass" variant="normal" />

      <div className="bg-dark py-5">
        <Radio name="fail" variant="dark" />
      </div>
    </div>
  );
}
