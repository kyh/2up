import type { Message } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { convertToCoreMessages, streamText } from "ai";

import { cached } from "./ai-middleware";
import { getSystemPrompt } from "./prompt";
import { aiDeveloperTools } from "./tools";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const xai = createXai({
  apiKey: process.env.XAI_API_KEY,
});

const models = {
  anthropic: anthropic("claude-3-7-sonnet-20250219"),
  google: google("gemini-2.5-flash-preview-04-17"),
  openai: openai("o4-mini"),
  xai: xai("grok-3"),
};

export const createGame = (
  existingFiles: Record<string, string>,
  messages: Message[],
) => {
  const systemPrompt = getSystemPrompt(existingFiles);

  console.log("systemPrompt", systemPrompt);

  const result = streamText({
    model: models.anthropic,
    system: systemPrompt,
    messages: convertToCoreMessages(messages),
    tools: aiDeveloperTools,
    toolCallStreaming: true,
    maxSteps: 10,
    onChunk: (chunk) => {
      console.log("chunk", chunk);
    },
  });

  return result.toDataStreamResponse({
    sendReasoning: true,
    getErrorMessage: (error) => {
      console.error(error);
      return "An error occurred while processing the messages";
    },
  });
};
