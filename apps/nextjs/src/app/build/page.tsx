"use client";

import { useCallback, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { Spinner } from "@init/ui/spinner";
import { toast } from "@init/ui/toast";

import { ChatHistory } from "./_components/chat-history";
import { CodeEditor } from "./_components/code-editor";
import { Composer } from "./_components/composer";
import { useMessageParser } from "./_components/message-parser";
import { Preview, SandpackProvider } from "./_components/sandpack";

const Page = () => {
  const [composerOpen, setComposerOpen] = useState(true);
  const [codeEditorOpen, setCodeEditorOpen] = useState(false);
  const [chatHistoryOpen, setChatHistoryOpen] = useState(false);
  const { sandpack } = useSandpack();
  const { messageParser } = useMessageParser({
    callbacks: {
      onActionOpen: () => {
        setComposerOpen(false);
      },
      onArtifactClose: (state, parsedMessage) => {
        sandpack.updateFile(
          parsedMessage.actions.reduce(
            (acc, action) => {
              acc[action.filePath] = action.content;
              return acc;
            },
            {} as Record<string, string>,
          ),
        );
        console.log("currentState: ", state);
        console.log("parsedMessage: ", parsedMessage);
      },
    },
  });

  const { messages, append, status, input, setInput } = useChat({
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
  const lastMessage = messages[messages.length - 1];
  let parsedMessage;
  if (lastMessage && lastMessage.role === "assistant") {
    console.log("lastMessage", lastMessage);
    parsedMessage = messageParser.parse(lastMessage.id, lastMessage.content);
    console.log("parsedMessage", parsedMessage);
  }

  return (
    <>
      {parsedMessage && (
        <div className="absolute flex flex-col gap-1">
          <div>{parsedMessage.contentBeforeArtifact}</div>
          <div className="flex flex-col gap-1">
            {parsedMessage.actions.map((action) => {
              return (
                <div key={action.filePath} className="flex gap-1">
                  <Spinner />
                  {action.filePath}
                </div>
              );
            })}
          </div>
          <div>{parsedMessage.contentAfterArtifact}</div>
        </div>
      )}
      <Preview />
      <Composer
        composerOpen={composerOpen}
        setComposerOpen={setComposerOpen}
        codeEditorOpen={codeEditorOpen}
        setCodeEditorOpen={setCodeEditorOpen}
        chatHistoryOpen={chatHistoryOpen}
        setChatHistoryOpen={setChatHistoryOpen}
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
        chatHistoryOpen={chatHistoryOpen}
        setChatHistoryOpen={setChatHistoryOpen}
        messages={messages}
        messageParser={messageParser}
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isGeneratingResponse={isGeneratingResponse}
      />
    </>
  );
};

const PageContainer = () => {
  return (
    <main className="h-dvh w-dvw overflow-hidden">
      <SandpackProvider>
        <Page />
      </SandpackProvider>
    </main>
  );
};

export default PageContainer;
