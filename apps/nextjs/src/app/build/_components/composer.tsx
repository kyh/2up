"use client";

import { memo } from "react";
import { useSandpackNavigation } from "@codesandbox/sandpack-react";
import { Button } from "@init/ui/button";
import { cn } from "@init/ui/utils";
import {
  ArrowUp,
  ChevronDown,
  ChevronUp,
  CodeIcon,
  RefreshCwIcon,
} from "lucide-react";

import {
  PromptInput,
  PromptInputActions,
  PromptInputTextarea,
} from "./ai-chat-input";

type ComposerProps = {
  composerOpen?: boolean;
  setComposerOpen?: (open: boolean) => void;
  codeEditorOpen?: boolean;
  setCodeEditorOpen?: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  onSubmit?: () => void;
  isGeneratingResponse?: boolean;
};

export const Composer = memo(
  ({
    composerOpen = true,
    setComposerOpen,
    codeEditorOpen,
    setCodeEditorOpen,
    value = "",
    onValueChange,
    onSubmit,
    isGeneratingResponse,
  }: ComposerProps) => {
    const { refresh } = useSandpackNavigation();

    return (
      <div
        className={cn(
          "pointer-events-none fixed right-0 bottom-0 left-0 z-10 flex items-center justify-center transition",
          composerOpen ? "" : "translate-y-[calc(100%-32px)]",
        )}
      >
        <div className="bg-muted/50 pointer-events-auto w-full max-w-lg rounded-t-2xl px-2 backdrop-blur-sm">
          <div className="flex h-8 items-center justify-between gap-3 px-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="size-5 p-0"
                onClick={() => setCodeEditorOpen?.(!codeEditorOpen)}
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
              onClick={() => setComposerOpen?.(!composerOpen)}
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
          <PromptInput
            value={value}
            onValueChange={onValueChange}
            onSubmit={onSubmit}
          >
            <PromptInputTextarea placeholder="Build a 3d platformer..." />
            <PromptInputActions className="pt-2">
              <Button
                size="icon"
                className="ml-auto h-8 w-8 rounded-full"
                onClick={onSubmit}
                loading={isGeneratingResponse}
              >
                <ArrowUp className="size-5" />
              </Button>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.composerOpen === nextProps.composerOpen &&
      prevProps.codeEditorOpen === nextProps.codeEditorOpen &&
      prevProps.value === nextProps.value &&
      prevProps.isGeneratingResponse === nextProps.isGeneratingResponse
    );
  },
);
