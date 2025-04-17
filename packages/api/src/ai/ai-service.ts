import type { Message } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";

import { cached } from "./ai-middleware";
import { getSystemPrompt } from "./prompt";
import { aiDeveloperTools } from "./tools";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const createGame = (messages: Message[]) => {
  const result = streamText({
    model: cached(anthropic("claude-3-5-sonnet-20240620")),
    system: getSystemPrompt(),
    messages: convertToCoreMessages(messages),
    tools: aiDeveloperTools,
    toolCallStreaming: true,
    maxSteps: 5,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      console.error(error);
      return "An error occurred while processing the messages";
    },
  });
};
