import type { UIMessage } from "ai";
import { memo } from "react";
import {
  ChatTextarea,
  Message,
  MessageAvatar,
  MessageContent,
  MessagesContainer,
} from "@init/ui/chat";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@init/ui/drawer";

import type { StreamingMessageParser } from "./message-parser";

type ChatHistoryProps = {
  chatHistoryOpen: boolean;
  setChatHistoryOpen: (open: boolean) => void;
  messages: UIMessage[];
  messageParser: StreamingMessageParser;
  input: string;
  setInput: (input: string) => void;
  onSubmit: () => void;
  isGeneratingResponse: boolean;
};

export const ChatHistory = memo(
  function ChatHistory({
    chatHistoryOpen,
    setChatHistoryOpen,
    messages,
    messageParser,
    input,
    setInput,
    onSubmit,
    isGeneratingResponse,
  }: ChatHistoryProps) {
    return (
      <Drawer open={chatHistoryOpen} onOpenChange={setChatHistoryOpen}>
        <DrawerContent className="max-h-[90dvh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Chat History</DrawerTitle>
            <DrawerDescription>
              You can edit the code for your game directly
            </DrawerDescription>
          </DrawerHeader>
          <MessagesContainer className="m-auto w-full max-w-(--breakpoint-md) flex-1 space-y-4 p-4">
            {!messages.length && (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            )}
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
                      <MessageContent className="bg-secondary text-secondary-foreground">
                        {
                          messageParser.getParsedMessage(message.id)
                            ?.contentBeforeArtifact
                        }
                        {messageParser
                          .getParsedMessage(message.id)
                          ?.actions.map((action) => {
                            return (
                              <div key={action.filePath} className="flex gap-1">
                                <span>{action.filePath}</span>
                              </div>
                            );
                          })}
                        {
                          messageParser.getParsedMessage(message.id)
                            ?.contentAfterArtifact
                        }
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
          </MessagesContainer>
          <div className="m-auto w-full max-w-(--breakpoint-md) p-4">
            <ChatTextarea
              className="border-border rounded-b-xl border"
              input={input}
              setInput={setInput}
              onSubmit={onSubmit}
              isGeneratingResponse={isGeneratingResponse}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.chatHistoryOpen === nextProps.chatHistoryOpen &&
      prevProps.messages.length === nextProps.messages.length &&
      prevProps.input === nextProps.input &&
      prevProps.isGeneratingResponse === nextProps.isGeneratingResponse &&
      prevProps.messageParser === nextProps.messageParser &&
      prevProps.setInput === nextProps.setInput &&
      prevProps.onSubmit === nextProps.onSubmit
    );
  },
);
