import React from "react";

import Progres from "./ui/NosProgres";

export default function Progress() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Progress
      </span>

      <Progres type="normal" percent="80" />
      <Progres type="primary" percent="65" />
      <Progres type="success" percent="50" />
      <Progres type="warning" percent="35" />
      <Progres type="error" percent="20" />
      <Progres type="pattern" percent="50" />
    </div>
  );
}
