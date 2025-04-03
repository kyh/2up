import type { UIMessage } from "ai";
import { memo } from "react";
import { Message, MessageContent, MessagesContainer } from "@init/ui/chat";
import { Spinner } from "@init/ui/spinner";
import { cn } from "@init/ui/utils";
import { CircleCheckIcon } from "lucide-react";

import type { ParsedMessage } from "./message-parser";
import { isFileAction, parseMessage } from "./message-parser";

type ChatHistoryProps = {
  composerOpen: boolean;
  messages: UIMessage[];
  isGeneratingResponse: boolean;
};

export const ChatHistory = memo(
  function ChatHistory({ composerOpen, messages }: ChatHistoryProps) {
    if (!composerOpen) {
      return null;
    }

    return (
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-10 flex items-center justify-center transition">
        <MessagesContainer className="pointer-events-auto m-auto max-h-[80dvh] w-full max-w-lg flex-1 space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";
            let parsedMessage: ParsedMessage | undefined;
            if (isAssistant) {
              parsedMessage = parseMessage(message.id, message.content);
            }

            return (
              <Message
                key={message.id}
                className={cn(!isAssistant && "justify-end")}
              >
                <MessageContent className={cn(!isAssistant && "bg-primary/10")}>
                  {parsedMessage ? (
                    <>
                      {parsedMessage.contentBeforeArtifact}
                      {parsedMessage.actions.map((action, index) => {
                        if (!isFileAction(action)) return null;
                        return (
                          <div
                            key={index}
                            className="my-2 flex items-center gap-1"
                          >
                            {action.isParsed ? (
                              <>
                                <CircleCheckIcon className="size-4" />
                                <span>{action.filePath}</span>
                              </>
                            ) : (
                              <>
                                <Spinner />
                                <span>Generating {action.filePath}</span>
                              </>
                            )}
                          </div>
                        );
                      })}
                      {parsedMessage.contentAfterArtifact}
                    </>
                  ) : (
                    message.content
                  )}
                </MessageContent>
              </Message>
            );
          })}
        </MessagesContainer>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.composerOpen === nextProps.composerOpen &&
      prevProps.messages === nextProps.messages &&
      prevProps.isGeneratingResponse === nextProps.isGeneratingResponse
    );
  },
);
