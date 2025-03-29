import type { Message } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { convertToCoreMessages, streamText } from "ai";

import { getSystemPrompt } from "./prompt";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: Message[];
  };

  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    system: getSystemPrompt(),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      console.error(error);
      return "An error occurred while processing the messages";
    },
  });
}
