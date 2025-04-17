import type { Message } from "ai";
import { createGame } from "@kyh/api/ai/ai-service";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { messages } = (await request.json()) as {
    messages: Message[];
  };

  return createGame(messages);
}
