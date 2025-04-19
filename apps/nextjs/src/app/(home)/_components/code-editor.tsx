import { memo } from "react";
import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@kyh/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@kyh/ui/tabs";

type CodeEditorProps = {
  codeEditorOpen: boolean;
  setCodeEditorOpen: (open: boolean) => void;
  clientId?: string;
};

export const CodeEditor = memo(
  function CodeEditor({
    clientId,
    codeEditorOpen,
    setCodeEditorOpen,
  }: CodeEditorProps) {
    return (
      <Drawer open={codeEditorOpen} onOpenChange={setCodeEditorOpen}>
        <DrawerContent noPortal className="bg-[#151515]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Code editor</DrawerTitle>
            <DrawerDescription>
              You can edit the code for your game directly
            </DrawerDescription>
          </DrawerHeader>
          <Tabs defaultValue="code">
            <div className="border-b px-3 py-2">
              <TabsList>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="console">Console</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent className="flex h-[85dvh] overflow-auto" value="code">
              <SandpackFileExplorer className="w-48! border-r border-[var(--sp-colors-surface2)]" />
              <SandpackCodeEditor
                className="flex-1"
                showLineNumbers
                showInlineErrors
              />
            </TabsContent>
            <TabsContent className="h-[85dvh] overflow-auto" value="console">
              <SandpackConsole clientId={clientId} />
            </TabsContent>
          </Tabs>
        </DrawerContent>
      </Drawer>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.codeEditorOpen === nextProps.codeEditorOpen &&
      prevProps.clientId === nextProps.clientId
    );
  },
);
