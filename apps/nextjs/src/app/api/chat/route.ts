import type { Message } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { mockData } from "@init/api/build/mock-data";
import { getSystemPrompt } from "@init/api/build/prompt";
import { convertToCoreMessages, simulateReadableStream, streamText } from "ai";
import { MockLanguageModelV1 } from "ai/test";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const maxDuration = 60;

const mock = true;

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: Message[];
  };

  if (mock) {
    const result = streamText({
      model: new MockLanguageModelV1({
        doStream: async () => ({
          stream: simulateReadableStream({
            chunks: [
              ...mockData.map((message) => ({
                type: "text-delta" as const,
                textDelta: ` ${message}`,
              })),
              {
                type: "finish",
                finishReason: "stop",
                logprobs: undefined,
                usage: { completionTokens: 0, promptTokens: 0 },
              },
            ],
          }),
          rawCall: { rawPrompt: null, rawSettings: {} },
        }),
      }),
      prompt: "mock",
    });

    return result.toDataStreamResponse();
  }

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
