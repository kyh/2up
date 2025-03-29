"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@init/ui/button";
import { Spinner } from "@init/ui/spinner";
import { toast } from "@init/ui/toast";
import { ArrowUp, Square } from "lucide-react";

import type { VgArtifact } from "./_components/message-parser";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "./_components/ai-chat-input";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessagesContainer,
} from "./_components/ai-chat-message";
import { dummy } from "./_components/dummy";
import {
  convertToSandpackFiles,
  parseMessage,
} from "./_components/message-parser";
import { ReactRenderer } from "./_components/react-renderer";

const Page = () => {
  const [selectedArtifact, setSelectedArtifact] = useState<VgArtifact | null>(
    null,
  );
  const { messages, append, status, stop, input, setInput } = useChat({
    onFinish: (message) => {
      const isAssistant = message.role === "assistant";
      if (isAssistant) {
        const parsedMessage = parseMessage(message.content);
        if (parsedMessage.artifact) {
          setSelectedArtifact(parsedMessage.artifact);
        }
      }
    },
    onError: (error) => {
      toast.error(`An error occurred, ${error.message}`);
    },
    // initialMessages: dummy,
  });

  const handleSubmit = () => {
    if (input === "") {
      return;
    }

    if (isGeneratingResponse) {
      stop();
    } else {
      void append({
        role: "user",
        content: input,
        createdAt: new Date(),
      });
    }

    setInput("");
  };

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  return (
    <main className="flex">
      <section className="flex h-dvh w-md flex-col px-5 pb-5">
        <MessagesContainer className="m-auto w-full max-w-(--breakpoint-md) flex-1 space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            const parsedMessage = isAssistant
              ? parseMessage(message.content)
              : null;

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
                  {isAssistant && parsedMessage ? (
                    <>
                      <MessageContent
                        className="bg-secondary text-secondary-foreground"
                        markdown
                      >
                        {parsedMessage.textContent}
                      </MessageContent>
                      {!!parsedMessage.artifact && (
                        <Button
                          onClick={() =>
                            setSelectedArtifact(parsedMessage.artifact)
                          }
                        >
                          View Game
                        </Button>
                      )}
                      {!parsedMessage.isComplete && (
                        <div className="flex gap-1">
                          <Spinner /> Generating {parsedMessage.currentFilePath}
                        </div>
                      )}
                    </>
                  ) : (
                    <MessageContent className="bg-primary text-primary-foreground">
                      {message.content}
                    </MessageContent>
                  )}
                </div>
              </Message>
            );
          })}
        </MessagesContainer>
        <PromptInput
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          className="m-auto w-full"
        >
          <PromptInputTextarea placeholder="Ask me anything..." />
          <PromptInputActions className="flex items-center justify-between gap-2 pt-2">
            <PromptInputAction
              tooltip={
                isGeneratingResponse ? "Stop generation" : "Send message"
              }
            >
              <Button
                size="icon"
                className="ml-auto h-8 w-8 rounded-full"
                onClick={handleSubmit}
              >
                {isGeneratingResponse ? (
                  <Square className="size-5" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </section>
      <section className="flex-1 p-5">
        {selectedArtifact ? (
          <ReactRenderer
            files={convertToSandpackFiles(selectedArtifact.actions)}
          />
        ) : (
          "No game selected"
        )}
      </section>
    </main>
  );
};

export default Page;
