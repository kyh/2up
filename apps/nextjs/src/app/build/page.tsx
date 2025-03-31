"use client";

import { useCallback, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
  useSandpackNavigation,
} from "@codesandbox/sandpack-react";
import { cyberpunk } from "@codesandbox/sandpack-themes";
import { dependencies } from "@init/api/build/prompt";
import { Button } from "@init/ui/button";
import { Spinner } from "@init/ui/spinner";
import { toast } from "@init/ui/toast";

import type { ParsedMessage, VgArtifact } from "./_components/message-parser";
import type { SandpackFile } from "@codesandbox/sandpack-react";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessagesContainer,
} from "./_components/ai-chat-message";
import { CodeEditor } from "./_components/code-editor";
import { Composer } from "./_components/composer";
import {
  convertToSandpackFiles,
  parseMessage,
} from "./_components/message-parser";
import { Preview } from "./_components/preview";

const Page = () => {
  const [composerOpen, setComposerOpen] = useState(true);
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { refresh } = useSandpackNavigation();
  const { sandpack, listen } = useSandpack();

  const { messages, append, status, stop, input, setInput } = useChat({
    onResponse: () => {
      setComposerOpen(false);
    },
    onFinish: (message) => {
      const isAssistant = message.role === "assistant";
      if (isAssistant) {
        const parsedMessage = parseMessage(message.content);
        if (parsedMessage.artifact) {
          const files = convertToSandpackFiles(parsedMessage.artifact.actions);
          sandpack.updateFile(files);
          setShowPreview(true);
        }
      }
    },
    onError: (error) => {
      toast.error(`An error occurred, ${error.message}`);
    },
  });

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);
  const handleSubmit = useCallback(() => {
    if (input === "") return;

    if (isGeneratingResponse) {
      stop();
      return;
    }

    setInput("");
    void append({
      role: "user",
      content: input,
      createdAt: new Date(),
    });
  }, [input, isGeneratingResponse, setInput, append, stop]);

  const lastMessage = messages.at(-1);
  let parsedMessage: ParsedMessage | undefined;
  if (lastMessage && lastMessage.role === "assistant") {
    parsedMessage = parseMessage(lastMessage.content);
  }

  return (
    <main className="h-dvh w-dvw overflow-hidden">
      {isGeneratingResponse && (
        <div className="flex gap-3">
          <Spinner />
          <p className="text-muted-foreground text-sm">
            {parsedMessage?.textContent}
            {parsedMessage?.currentFilePath}
          </p>
        </div>
      )}
      {showPreview && <Preview />}
      <CodeEditor
        codeEditorOpen={codeEditorOpen}
        setCodeEditorOpen={setCodeEditorOpen}
      />
      <Composer
        composerOpen={composerOpen}
        setComposerOpen={setComposerOpen}
        codeEditorOpen={codeEditorOpen}
        setCodeEditorOpen={setCodeEditorOpen}
        value={input}
        onValueChange={setInput}
        onSubmit={handleSubmit}
        isGeneratingResponse={isGeneratingResponse}
      />
    </main>
  );
};

const PageContainer = () => {
  return (
    <SandpackProvider
      template="vite-react"
      theme={cyberpunk}
      customSetup={{ dependencies }}
      options={{
        classes: {
          "sp-wrapper": "h-full!",
          "sp-preview": "h-full!",
          "sp-layout": "h-[90dvh]",
          "sp-file-explorer": "h-full!",
          "sp-editor": "h-full!",
        },
      }}
    >
      <Page />
    </SandpackProvider>
  );
};

export default PageContainer;

/* <MessagesContainer className="m-auto w-full max-w-(--breakpoint-md) flex-1 space-y-4 p-4">
        {messages.map((message) => {
          const isAssistant = message.role === "assistant";
          return (
            <Message
              key={message.id}
              className={
                message.role === "user" ? "justify-end" : "justify-start"
              }
            >
              {isAssistant && (
                <MessageAvatar
                  src="/avatars/ai.png"
                  alt="AI Assistant"
                  fallback="AI"
                />
              )}
              <div className="max-w-[85%] flex-1 sm:max-w-[75%]">
                {isAssistant ? (
                  <MessageContent
                    className="bg-secondary text-secondary-foreground"
                    markdown
                  >
                    {message.content}
                  </MessageContent>
                ) : (
                  <MessageContent className="bg-primary text-primary-foreground">
                    {message.content}
                  </MessageContent>
                )}
              </div>
            </Message>
          );
        })}
      </MessagesContainer> */
