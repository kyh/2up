import { memo } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";

export const Preview = memo(() => {
  return (
    <SandpackPreview
      showOpenInCodeSandbox={false}
      showRefreshButton={false}
      showRestartButton={false}
    />
  );
});
