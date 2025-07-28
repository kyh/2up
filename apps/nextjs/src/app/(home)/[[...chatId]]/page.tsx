"use client";

import { useParams } from "next/navigation";
import { Spinner } from "@repo/ui/spinner";
import { TextShimmer } from "@repo/ui/text-shimmer";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/react";

const Page = () => {
  const trpc = useTRPC();
  const params = useParams();
  const chatId = params.chatId?.toString();
  const { data: userData } = useSuspenseQuery(
    trpc.auth.workspace.queryOptions(),
  );
  const { data: chatData, isPending: getChatPending } = useQuery(
    trpc.ai.getChat.queryOptions(
      { chatId: chatId?.toString() ?? "" },
      {
        enabled: !!userData.user && !!chatId,
        refetchInterval: (query) => {
          // Poll every 2 seconds while isGenerating is true
          if (
            query.state.status === "pending" ||
            !query.state.data?.chat.demo ||
            query.state.data.chat.latestVersion?.status === "pending"
          ) {
            return 2000;
          }
          return false;
        },
      },
    ),
  );

  const isGenerating =
    getChatPending ||
    !chatData?.chat.demo ||
    chatData.chat.latestVersion?.status === "pending";

  const iframeSrc =
    chatData?.chat.latestVersion?.status === "completed" && chatData.chat.demo
      ? chatData.chat.demo
      : "/demo";

  return (
    <>
      {isGenerating && (
        <div className="pointer-events-none col-span-full row-span-full flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Spinner />
            <TextShimmer className="font-mono text-sm" duration={1}>
              Generating...
            </TextShimmer>
          </div>
        </div>
      )}
      <iframe
        className="col-span-full row-span-full h-full w-full"
        src={iframeSrc}
      />
    </>
  );
};

export default Page;
