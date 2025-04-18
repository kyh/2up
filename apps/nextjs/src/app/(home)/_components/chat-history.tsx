import type { UIMessage } from "ai";
import { memo } from "react";
import { Message, MessageContent, MessagesContainer } from "@kyh/ui/chat";
import { Spinner } from "@kyh/ui/spinner";
import { cn } from "@kyh/ui/utils";
import equal from "fast-deep-equal";
import { CircleCheckIcon } from "lucide-react";

import type { CreateFileSchema } from "@kyh/api/ai/tools";

type MessagePartProps = {
  part: UIMessage["parts"][number];
};

const MessagePart = memo(
  ({ part }: MessagePartProps) => {
    if (part.type === "text") {
      return <>{part.text}</>;
    }

    if (part.type === "tool-invocation") {
      const toolArgs = part.toolInvocation.args as CreateFileSchema | undefined;
      if (part.toolInvocation.state === "partial-call") {
        return (
          <div className="mt-1 flex items-center gap-1">
            <Spinner className="size-5" />
            <span>Generating {toolArgs?.filePath}</span>
          </div>
        );
      }

      return (
        <div className="mt-1 flex items-center gap-1">
          <CircleCheckIcon className="size-5" />
          <span>{toolArgs?.filePath}</span>
        </div>
      );
    }

    return null;
  },
  (prevProps, nextProps) => equal(prevProps, nextProps),
);

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
        <MessagesContainer className="pointer-events-auto mx-auto max-h-[80dvh] w-full max-w-lg flex-1 space-y-4 p-4">
          {messages.map((message) => {
            const isAssistant = message.role === "assistant";

            return (
              <Message
                key={message.id}
                className={cn(!isAssistant && "justify-end")}
              >
                <MessageContent className={cn(!isAssistant && "bg-primary/10")}>
                  {message.parts.map((part, index) => (
                    <MessagePart key={index} part={part} />
                  ))}
                </MessageContent>
              </Message>
            );
          })}
        </MessagesContainer>
      </div>
    );
  },
  (prevProps, nextProps) => equal(prevProps, nextProps),
);
