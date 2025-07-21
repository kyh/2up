import type { UIMessage } from "ai";
import { memo } from "react";
import { Message, MessageContent, MessagesContainer } from "@repo/ui/chat";
import { Spinner } from "@repo/ui/spinner";
import { cn } from "@repo/ui/utils";
import equal from "fast-deep-equal";
import { CircleCheckIcon, CircleDotIcon, CircleMinusIcon } from "lucide-react";

import type {
  CreateFileSchema,
  DeleteFileSchema,
  UpdateFileSchema,
} from "@repo/api/ai/tools";

type MessagePartProps = {
  part: UIMessage["parts"][number];
};

const MessagePart = memo(
  ({ part }: MessagePartProps) => {
    if (part.type === "text") {
      return <>{part.text}</>;
    }

    if (part.type === "tool-createFile") {
      return (
        <div className="mt-1 flex items-center gap-1">
          {part.state === "output-available" ? (
            <CircleCheckIcon className="size-5" />
          ) : (
            <Spinner className="size-5" />
          )}
          <span>
            {part.output
              ? (part.output as CreateFileSchema).filePath
              : "Creating..."}
          </span>
        </div>
      );
    }

    if (part.type === "tool-updateFile") {
      return (
        <div className="mt-1 flex items-center gap-1">
          {part.state === "output-available" ? (
            <CircleDotIcon className="size-5" />
          ) : (
            <Spinner className="size-5" />
          )}
          <span>
            {part.output
              ? (part.output as UpdateFileSchema).filePath
              : "Updating..."}
          </span>
        </div>
      );
    }

    if (part.type === "tool-deleteFile") {
      return (
        <div className="mt-1 flex items-center gap-1">
          {part.state === "output-available" ? (
            <CircleMinusIcon className="size-5" />
          ) : (
            <Spinner className="size-5" />
          )}
          <span>
            {part.output
              ? (part.output as DeleteFileSchema).filePath
              : "Deleting..."}
          </span>
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
