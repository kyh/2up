import { memo } from "react";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@init/ui/drawer";

type CodeEditorProps = {
  codeEditorOpen: boolean;
  setCodeEditorOpen: (open: boolean) => void;
};

export const CodeEditor = memo(
  ({ codeEditorOpen, setCodeEditorOpen }: CodeEditorProps) => {
    return (
      <Drawer open={codeEditorOpen} onOpenChange={setCodeEditorOpen}>
        <DrawerContent noPortal>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Code editor</DrawerTitle>
            <DrawerDescription>
              You can edit the code for your game directly
            </DrawerDescription>
          </DrawerHeader>
          <SandpackLayout>
            <SandpackFileExplorer />
            <SandpackCodeEditor showLineNumbers showInlineErrors />
          </SandpackLayout>
        </DrawerContent>
      </Drawer>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.codeEditorOpen === nextProps.codeEditorOpen;
  },
);
