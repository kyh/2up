import React from "react";
import { Textarea } from "@2up/ui/ui/textarea";

export default function NosTextarea() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Textarea
      </span>

      <Textarea id="txt" name="name" label="Textarea" variant="dark" />
    </div>
  );
}
