"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { toast } from "@kyh/ui/toast";
import { useSuspenseQuery } from "@tanstack/react-query";

import type { SandpackFiles } from "./_components/sandpack";
import type { CreateFileSchema, DeleteFileSchema } from "@kyh/api/ai/tools";
import { useTRPC } from "@/trpc/react";
import { ChatHistory } from "./_components/chat-history";
import { CodeEditor } from "./_components/code-editor";
import { Composer } from "./_components/composer";
import {
  defaultFiles,
  Preview,
  SandpackProvider,
} from "./_components/sandpack";
import { WaitlistDailog } from "./_components/waitlist-form";

const Page = ({
  setFiles,
}: {
  setFiles: Dispatch<SetStateAction<SandpackFiles>>;
}) => {
  const trpc = useTRPC();
  const {
    data: { user },
  } = useSuspenseQuery(trpc.auth.workspace.queryOptions());
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(true);
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);

  const { messages, append, status, input, setInput } = useChat({
    onFinish: (message) => {
      if (message.role === "assistant") {
        setFiles((prevFiles) => {
          const updatedFiles = message.parts?.reduce((acc, part) => {
            if (part.type === "tool-invocation") {
              if (
                part.toolInvocation.toolName === "createFile" ||
                part.toolInvocation.toolName === "updateFile"
              ) {
                const { filePath, content } = part.toolInvocation
                  .args as CreateFileSchema;
                acc[filePath] = { code: content };
              }

              if (part.toolInvocation.toolName === "deleteFile") {
                const { filePath } = part.toolInvocation
                  .args as DeleteFileSchema;
                delete acc[filePath];
              }
            }

            return acc;
          }, prevFiles);

          return { ...updatedFiles };
        });
        setComposerOpen(false);
      }
    },
    onError: (error) => {
      toast.error(`An error occurred, ${error.message}`);
    },
  });

  const handleSubmit = useCallback(() => {
    if (input === "") return;
    if (!user) {
      setWaitlistOpen(true);
      return;
    }
    setInput("");
    void append({
      role: "user",
      content: input,
      createdAt: new Date(),
    });
  }, [input, setInput, append, user]);

  const handleFocus = useCallback(() => {
    if (!user) {
      setWaitlistOpen(true);
      return;
    }
  }, [user]);

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  return (
    <>
      <Preview />
      <Composer
        composerOpen={composerOpen}
        setComposerOpen={setComposerOpen}
        codeEditorOpen={codeEditorOpen}
        setCodeEditorOpen={setCodeEditorOpen}
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isGeneratingResponse={isGeneratingResponse}
        onFocus={handleFocus}
      />
      <CodeEditor
        codeEditorOpen={codeEditorOpen}
        setCodeEditorOpen={setCodeEditorOpen}
      />
      <ChatHistory
        composerOpen={composerOpen}
        messages={messages}
        isGeneratingResponse={isGeneratingResponse}
      />
      <WaitlistDailog
        waitlistOpen={waitlistOpen}
        setWaitlistOpen={setWaitlistOpen}
      />
    </>
  );
};

const PageContainer = () => {
  const [files, setFiles] = useState<SandpackFiles>(defaultFiles);
  console.log("files", files);
  return (
    <SandpackProvider files={files}>
      <Page setFiles={setFiles} />
    </SandpackProvider>
  );
};

export default dynamic(() => Promise.resolve(PageContainer), {
  ssr: false,
});
