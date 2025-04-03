"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { toast } from "@init/ui/toast";

import type { SandpackFiles } from "./_components/sandpack";
import { ChatHistory } from "./_components/chat-history";
import { CodeEditor } from "./_components/code-editor";
import { Composer } from "./_components/composer";
import { isFileAction, parseMessage } from "./_components/message-parser";
import {
  defaultFiles,
  Preview,
  SandpackProvider,
} from "./_components/sandpack";

const Page = ({
  setFiles,
}: {
  setFiles: Dispatch<SetStateAction<SandpackFiles>>;
}) => {
  const [composerOpen, setComposerOpen] = useState(true);
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);

  const { messages, append, status, input, setInput } = useChat({
    onFinish: (message) => {
      if (message.role === "assistant") {
        const parsedMessage = parseMessage(message.id, message.content);
        setFiles((prevFiles) => {
          const updatedFiles = parsedMessage.actions.reduce((acc, action) => {
            if (isFileAction(action)) {
              acc[action.filePath] = { code: action.content };
            }
            return acc;
          }, {} as SandpackFiles);
          return { ...prevFiles, ...updatedFiles };
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
    setInput("");
    void append({
      role: "user",
      content: input,
      createdAt: new Date(),
    });
  }, [input, setInput, append]);

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
    </>
  );
};

const PageContainer = () => {
  const [files, setFiles] = useState<SandpackFiles>(defaultFiles);

  return (
    <main className="h-dvh w-dvw overflow-hidden">
      <SandpackProvider files={files}>
        <Page setFiles={setFiles} />
      </SandpackProvider>
    </main>
  );
};

export default PageContainer;
