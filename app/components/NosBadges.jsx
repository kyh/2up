import React from "react";

import starticon from "./icons/startIcon";
import { Badge } from "./ui/NosBadge";

export default function Badges() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Badges
      </span>

      <Badge variant="dark" label="this" />
      <Badge variant="primary" label="is" />
      <Badge variant="success" label="a" />
      <Badge variant="warning" label="great" />
      <Badge variant="error" label="framework!" />
      <Badge variant="dark" variant2="primary" label="npm" label2="1.1.0" />
      <Badge
        variant="dark"
        variant2="success"
        label="test"
        label2="100%"
        size="normal"
      />

      <div className="relative ml-1">
        <div className="absolute -left-4 -top-3 z-10 h-full w-full ">
          <Badge variant="warning" label={starticon} size="small" />
        </div>
        <Badge variant="primary" label="Icons" size="medium" />
      </div>

      <div className="relative   ml-1">
        <div className="absolute -left-4 -top-3 z-10 h-full w-full ">
          <Badge variant="dark" label="hi" size="small" />
        </div>
        <Badge variant="warning" label="text" size="medium" />
      </div>
    </div>
  );
}
