import { useState } from "react";
import {
  SandpackCodeEditor,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import { cyberpunk } from "@codesandbox/sandpack-themes";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@init/ui/drawer";

import type { SandpackFile } from "@codesandbox/sandpack-react";

type ReactRendererProps = {
  files: Record<string, SandpackFile>;
};

export const ReactRenderer = ({ files }: ReactRendererProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <SandpackProvider
      template="vite-react"
      theme={cyberpunk}
      files={files}
      customSetup={{ dependencies }}
      options={{
        classes: {
          "sp-wrapper": "h-full!",
          "sp-preview": "h-full!",
          "sp-preview-container": "h-full!",
        },
      }}
    >
      <SandpackPreview
        actionsChildren={
          <button onClick={() => setDrawerOpen(true)}>Code Editor</button>
        }
      />
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent noPortal>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Code editor</DrawerTitle>
            <DrawerDescription>
              You can edit the code for your game directly
            </DrawerDescription>
          </DrawerHeader>
          <SandpackCodeEditor showLineNumbers showInlineErrors />
        </DrawerContent>
      </Drawer>
    </SandpackProvider>
  );
};

const dependencies = {
  "@react-three/drei": "*",
  "@react-three/fiber": "*",
  "@react-three/rapier": "*",
  "@react-three/postprocessing": "*",
  leva: "*",
  react: "*",
  "react-dom": "*",
  three: "*",
  phaser: "*",
};
