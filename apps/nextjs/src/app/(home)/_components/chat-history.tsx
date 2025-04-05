import type { UIMessage } from "ai";
import { memo, useMemo } from "react";
import { Message, MessageContent, MessagesContainer } from "@init/ui/chat";
import { Spinner } from "@init/ui/spinner";
import { cn } from "@init/ui/utils";
import { CircleCheckIcon } from "lucide-react";

import type { VgActionData } from "./message-parser";
import { isFileAction, parseMessage } from "./message-parser";

type ChatHistoryProps = {
  composerOpen: boolean;
  messages: UIMessage[];
  isGeneratingResponse: boolean;
};

const ParsedMessageContent = memo(({ message }: { message: UIMessage }) => {
  const parsedMessage = useMemo(
    () =>
      message.role === "assistant"
        ? parseMessage(message.id, message.content)
        : undefined,
    [message.id, message.content, message.role],
  );

  if (!parsedMessage) {
    return <>{message.content}</>;
  }

  return (
    <>
      {parsedMessage.contentBeforeArtifact}
      {parsedMessage.actions.map((action, index) => (
        <MessageAction key={index} action={action} />
      ))}
      {parsedMessage.contentAfterArtifact}
    </>
  );
});

const MessageAction = memo(
  ({ action }: { action: VgActionData }) => {
    if (!isFileAction(action)) return null;
    const actionContent = action.isParsed ? (
      <>
        <CircleCheckIcon className="size-4" />
        <span>{action.filePath}</span>
      </>
    ) : (
      <>
        <Spinner />
        <span>Generating {action.filePath}</span>
      </>
    );
    return <div className="my-2 flex items-center gap-1">{actionContent}</div>;
  },
  (prevProps, nextProps) => {
    return prevProps.action.isParsed === nextProps.action.isParsed;
  },
);

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

            return (
              <Message
                key={message.id}
                className={cn(!isAssistant && "justify-end")}
              >
                <MessageContent className={cn(!isAssistant && "bg-primary/10")}>
                  <ParsedMessageContent message={message} />
                </MessageContent>
              </Message>
            );
          })}
        </MessagesContainer>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Deep compare messages to prevent unnecessary renders
    if (prevProps.messages.length !== nextProps.messages.length) {
      return false;
    }

    // Only re-render if the last message changed (e.g., for streaming)
    const prevLastMsg = prevProps.messages[prevProps.messages.length - 1];
    const nextLastMsg = nextProps.messages[nextProps.messages.length - 1];

    if (!prevLastMsg || !nextLastMsg) {
      return prevProps.composerOpen === nextProps.composerOpen;
    }

    const lastMessageChanged =
      prevLastMsg.id !== nextLastMsg.id ||
      prevLastMsg.content !== nextLastMsg.content;

    return (
      prevProps.composerOpen === nextProps.composerOpen &&
      !lastMessageChanged &&
      prevProps.isGeneratingResponse === nextProps.isGeneratingResponse
    );
  },
);
