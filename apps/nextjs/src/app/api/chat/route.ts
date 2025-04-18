import type { Message } from "ai";
import { createGame } from "@kyh/api/ai/ai-service";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { messages, existingFiles } = (await request.json()) as {
    messages: Message[];
    existingFiles: Record<string, string>;
  };

  return createGame(existingFiles, messages);
}
