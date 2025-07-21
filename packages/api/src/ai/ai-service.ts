import type { UIMessage } from "ai";
import {
  convertToModelMessages,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";

import { getSystemPrompt } from "./prompt";
import { aiDeveloperTools } from "./tools";

export const createGame = (
  existingFiles: Record<string, string>,
  messages: UIMessage[],
) => {
  const systemPrompt = getSystemPrompt(existingFiles);

  console.log("systemPrompt", systemPrompt);

  const result = streamText({
    model: "anthropic/claude-4-sonnet",
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    tools: aiDeveloperTools,
    stopWhen: stepCountIs(5),
    experimental_transform: smoothStream({ chunking: "word" }),
    onChunk: (chunk) => {
      console.log("chunk", chunk);
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
};
