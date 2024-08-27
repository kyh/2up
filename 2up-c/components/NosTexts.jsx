import React from "react";

import Text from "./ui/NosText";

export default function Texts() {
  return (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Texts
      </span>
      <Text variant="primary">Primary</Text>
      <Text variant="success">Success</Text>
      <Text variant="warning">Warning</Text>
      <Text variant="error">Error</Text>
      <Text variant="disabled">Disabled</Text>

      {/* <Text asChild>
        <h3>AsChild</h3>
      </Text> */}
    </div>
  );
}
