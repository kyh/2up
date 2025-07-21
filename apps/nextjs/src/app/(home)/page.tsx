"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useChat } from "@ai-sdk/react";
import { toast } from "@repo/ui/toast";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";

import type { SandpackFiles, SandpackPreviewRef } from "./_components/sandpack";
import type {
  CreateFileSchema,
  DeleteFileSchema,
  UpdateFileSchema,
} from "@repo/api/ai/tools";
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
  files,
  setFiles,
}: {
  files: SandpackFiles;
  setFiles: Dispatch<SetStateAction<SandpackFiles>>;
}) => {
  const trpc = useTRPC();
  const {
    data: { user },
  } = useSuspenseQuery(trpc.auth.workspace.queryOptions());
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(true);
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [input, setInput] = useState("");
  const previewRef = useRef<SandpackPreviewRef>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            messages,
            existingFiles: Object.entries(files).reduce(
              (acc, [key, value]) => {
                acc[key] = value.code;
                return acc;
              },
              {} as Record<string, string>,
            ),
            ...body,
          },
        };
      },
    }),
    onFinish: ({ message }) => {
      console.log("onFinish", message);
      if (message.role === "assistant") {
        setFiles((prevFiles) => {
          const updatedFiles = message.parts.reduce((acc, part) => {
            if (
              part.type === "tool-createFile" &&
              part.state === "output-available"
            ) {
              const { filePath, content } = part.output as CreateFileSchema;
              acc[filePath] = { code: content };
            }
            if (
              part.type === "tool-updateFile" &&
              part.state === "output-available"
            ) {
              const { filePath, content } = part.output as UpdateFileSchema;
              acc[filePath] = { code: content };
            }
            if (
              part.type === "tool-deleteFile" &&
              part.state === "output-available"
            ) {
              const { filePath } = part.output as DeleteFileSchema;
              delete acc[filePath];
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
    void sendMessage({
      text: input,
    });
    setInput("");
  }, [input, setInput, sendMessage, user]);

  const handleFocus = useCallback(() => {
    if (!user) {
      setWaitlistOpen(true);
      return;
    }
  }, [user]);

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);
  console.log("messages", messages);

  return (
    <>
      <Preview previewRef={previewRef} />
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
      {previewRef.current?.clientId && (
        <CodeEditor
          clientId={previewRef.current.clientId}
          codeEditorOpen={codeEditorOpen}
          setCodeEditorOpen={setCodeEditorOpen}
        />
      )}
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

  return (
    <SandpackProvider files={files}>
      <Page files={files} setFiles={setFiles} />
    </SandpackProvider>
  );
};

export default dynamic(() => Promise.resolve(PageContainer), {
  ssr: false,
});
