import type { UIMessage } from "ai";
import { createGame } from "@repo/api/ai/ai-service";

export const maxDuration = 60;

export async function POST(request: Request) {
  const { messages, existingFiles } = (await request.json()) as {
    messages: UIMessage[];
    existingFiles: Record<string, string>;
  };

  return createGame(existingFiles, messages);
}
