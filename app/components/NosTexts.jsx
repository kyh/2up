import React from "react";

import Text from "./ui/NosText";

export default function Texts() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Texts
      </span>

      <Text type="primary">Primary</Text>
      <Text type="success">Success</Text>
      <Text type="warning">Warning</Text>
      <Text type="error">Error</Text>
      <Text type="disabled">Disabled</Text>
    </div>
  );
}
