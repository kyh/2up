import type { UIMessage } from "ai";
import { memo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@init/ui/drawer";

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessagesContainer,
} from "./ai-chat-message";

type ChatHistoryProps = {
  messages: UIMessage[];
  chatHistoryOpen: boolean;
  setChatHistoryOpen: (open: boolean) => void;
};

export const ChatHistory = memo(
  ({ messages, chatHistoryOpen, setChatHistoryOpen }: ChatHistoryProps) => {
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
          </MessagesContainer>
        </DrawerContent>
      </Drawer>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.chatHistoryOpen === nextProps.chatHistoryOpen &&
      prevProps.messages === nextProps.messages
    );
  },
);
