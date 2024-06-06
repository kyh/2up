import React from "react";

import Balloon from "./NosBalloon";

export default function Cursor({ type, from, children, ...props }) {
  return (
    <div className="cursor-pointer">
      <Balloon type={type} from={from}>
        {children}
      </Balloon>
    </div>
  );
}
