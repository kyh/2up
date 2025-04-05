import { memo } from "react";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
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
  function CodeEditor({ codeEditorOpen, setCodeEditorOpen }: CodeEditorProps) {
    return (
      <Drawer open={codeEditorOpen} onOpenChange={setCodeEditorOpen}>
        <DrawerContent noPortal>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Code editor</DrawerTitle>
            <DrawerDescription>
              You can edit the code for your game directly
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex h-[90dvh] overflow-auto">
            <SandpackFileExplorer className="w-48! border-r border-[var(--sp-colors-surface2)]" />
            <SandpackCodeEditor
              className="flex-1"
              showLineNumbers
              showInlineErrors
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.codeEditorOpen === nextProps.codeEditorOpen;
  },
);
