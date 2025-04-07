import { memo } from "react";
import { useSandpackNavigation } from "@codesandbox/sandpack-react";
import { Button } from "@kyh/ui/button";
import { ChatTextarea } from "@kyh/ui/chat";
import { cn } from "@kyh/ui/utils";
import { ChevronDown, ChevronUp, CodeIcon, RefreshCwIcon } from "lucide-react";

type ComposerProps = {
  composerOpen: boolean;
  setComposerOpen: (open: boolean) => void;
  codeEditorOpen: boolean;
  setCodeEditorOpen: (open: boolean) => void;
  input: string;
  setInput: (input: string) => void;
  onSubmit: () => void;
  isGeneratingResponse: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const Composer = memo(
  function Composer({
    composerOpen,
    setComposerOpen,
    codeEditorOpen,
    setCodeEditorOpen,
    input,
    setInput,
    onSubmit,
    isGeneratingResponse,
    onFocus,
    onBlur,
  }: ComposerProps) {
    const { refresh } = useSandpackNavigation();

    return (
      <div
        className={cn(
          "pointer-events-none fixed right-0 bottom-0 left-0 z-10 flex items-center justify-center transition",
          composerOpen ? "" : "translate-y-[calc(100%-32px)]",
        )}
      >
        <div className="bg-muted/40 pointer-events-auto w-full max-w-lg rounded-t-2xl px-3 shadow-lg backdrop-blur-xs">
          <div className="flex h-8 items-center justify-between gap-3 px-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="size-5 p-0"
                onClick={() => setCodeEditorOpen(!codeEditorOpen)}
              >
                <CodeIcon className="size-4" />
              </Button>
              <Button
                variant="ghost"
                className="size-5 p-0"
                onClick={() => refresh()}
              >
                <RefreshCwIcon className="size-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              className="size-5 p-0"
              onClick={() => setComposerOpen(!composerOpen)}
            >
              {composerOpen ? (
                <>
                  <ChevronDown className="size-4" />
                  <span className="sr-only">Collapse textarea</span>
                </>
              ) : (
                <>
                  <ChevronUp className="size-4" />
                  <span className="sr-only">Expand textarea</span>
                </>
              )}
            </Button>
          </div>
          <ChatTextarea
            input={input}
            setInput={setInput}
            onSubmit={onSubmit}
            isGeneratingResponse={isGeneratingResponse}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.composerOpen === nextProps.composerOpen &&
      prevProps.codeEditorOpen === nextProps.codeEditorOpen &&
      prevProps.input === nextProps.input &&
      prevProps.isGeneratingResponse === nextProps.isGeneratingResponse
    );
  },
);
