import React from "react";

import { List } from "./ui/list";

export default function Texts() {
  const listdata = [
    "Good morning.",
    "Thou hast had a good night's sleep, I hope.",
    "Thou hast had a good afternoon",
    "Good night.",
  ];
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Lists
      </span>

      <List variant="normal" data={listdata} />
      <List variant="dark" data={listdata} />
    </div>
  );
}
