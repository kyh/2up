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
import { ShootingStars } from "../(home)/_components/shooting-stars";
import { StarBackground } from "../(home)/_components/star-background";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessagesContainer,
} from "./_components/ai-chat-message";
import { ChatHistory } from "./_components/chat-history";
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
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { sandpack } = useSandpack();

  const { messages, append, status, input, setInput } = useChat({
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
  const lastMessage = messages.at(-1);
  useEffect(() => {
    if (lastMessage && lastMessage.role === "assistant") {
      const parsedMessage = parseMessage(lastMessage.content);
      if (parsedMessage.isComplete) {
        toast.dismiss("generating");
        return;
      }
      if (!parsedMessage.currentFilePath) {
        toast.loading(parsedMessage.textContent, {
          id: "generating",
        });
        return;
      }
      if (parsedMessage.currentFilePath) {
        toast.loading(parsedMessage.textContent, {
          id: "generating",
          description: `Updating ${parsedMessage.currentFilePath}`,
        });
        return;
      }
    }
  }, [lastMessage]);

  console.log("sandpack", sandpack);

  return (
    <main className="h-dvh w-dvw overflow-hidden">
      {!showPreview && (
        <div className="pointer-events-none fixed inset-0 h-screen w-full">
          <StarBackground />
          <ShootingStars />
        </div>
      )}
      {showPreview && <Preview />}
      <Composer
        composerOpen={composerOpen}
        setComposerOpen={setComposerOpen}
        codeEditorOpen={codeEditorOpen}
        setCodeEditorOpen={setCodeEditorOpen}
        chatHistoryOpen={chatHistoryOpen}
        setChatHistoryOpen={setChatHistoryOpen}
        value={input}
        onValueChange={setInput}
        onSubmit={handleSubmit}
        isGeneratingResponse={isGeneratingResponse}
      />
      <CodeEditor
        codeEditorOpen={codeEditorOpen}
        setCodeEditorOpen={setCodeEditorOpen}
      />
      <ChatHistory
        messages={messages}
        chatHistoryOpen={chatHistoryOpen}
        setChatHistoryOpen={setChatHistoryOpen}
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
