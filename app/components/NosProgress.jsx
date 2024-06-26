import React from "react";

import { Progress } from "./ui/NosProgress";

export default function ProgressComponents() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Progress
      </span>

      <Progress type="normal" percent="80" />
      <Progress type="primary" percent="65" />
      <Progress type="success" percent="50" />
      <Progress type="warning" percent="35" />
      <Progress type="error" percent="20" />
      <Progress type="pattern" percent="50" />
    </div>
  );
}
