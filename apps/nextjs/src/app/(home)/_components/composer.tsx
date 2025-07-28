"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@repo/ui/button";
import { ChatTextarea } from "@repo/ui/chat";
import { ExpandTabs } from "@repo/ui/expand-tabs";
import { cn } from "@repo/ui/utils";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { BlocksIcon, ChevronDown, ChevronUp, PlayIcon } from "lucide-react";
import { motion } from "motion/react";

import { useTRPC } from "@/trpc/react";
import { Card } from "./card";
import { featuredGames } from "./data";
import { WaitlistDailog } from "./waitlist-form";

export const Composer = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const params = useParams();
  const chatId = params.chatId?.toString();

  const { data: userData } = useSuspenseQuery(
    trpc.auth.workspace.queryOptions(),
  );

  const { mutate: createChat, isPending: createChatPending } = useMutation(
    trpc.ai.createChat.mutationOptions({
      onSuccess: (data) => {
        router.push(`/${data.chat.id}`);
      },
    }),
  );
  const { mutate: updateChat, isPending: updateChatPending } = useMutation(
    trpc.ai.updateChat.mutationOptions(),
  );

  const [view, setView] = useState<"play" | "build">("build");
  const [input, setInput] = useState("");
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(true);

  const handleSubmit = useCallback(() => {
    if (input === "") {
      return;
    }
    if (!userData.user) {
      setWaitlistOpen(true);
      return;
    }
    if (chatId) {
      updateChat({ chatId, message: input });
    } else {
      createChat({ message: input });
    }
    setInput("");
  }, [input, setInput, createChat, userData.user, chatId, updateChat]);

  const handleFocus = useCallback(() => {
    if (!userData.user) {
      setWaitlistOpen(true);
      return;
    }
  }, [userData.user]);

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed right-0 bottom-0 left-0 z-10 flex items-center justify-center transition",
          composerOpen ? "" : "translate-y-[calc(100%-32px)]",
        )}
      >
        <div className="pointer-events-auto relative px-3">
          <div className="flex h-8 items-center justify-between gap-3 px-2">
            <ExpandTabs
              selected={view}
              setSelected={(selected) => {
                setView(selected as "play" | "build");
                setComposerOpen(true);
              }}
              tabs={[
                { id: "play", title: "Play", icon: PlayIcon },
                { id: "build", title: "Build", icon: BlocksIcon },
              ]}
            />
            <Button
              variant="ghost"
              className="size-5 p-0"
              onClick={() => setComposerOpen(!composerOpen)}
            >
              {composerOpen ? (
                <>
                  <ChevronDown className="size-4" />
                  <span className="sr-only">Collapse composer</span>
                </>
              ) : (
                <>
                  <ChevronUp className="size-4" />
                  <span className="sr-only">Expand composer</span>
                </>
              )}
            </Button>
          </div>
          <motion.div
            transition={{
              type: "spring",
              bounce: 0.1,
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
              filter: "blur(5px)",
              originX: 0.5,
              originY: 0.5,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              originX: 0.5,
              originY: 0.5,
              transition: {
                delay: 0.05,
              },
            }}
            key={view}
          >
            {view === "build" && (
              <BuildView
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                loading={createChatPending || updateChatPending}
                onFocus={handleFocus}
              />
            )}
            {view === "play" && <PlayView />}
          </motion.div>
          <motion.div
            className="bg-muted/60 absolute inset-0 -z-10 rounded-t-2xl px-3 shadow-lg backdrop-blur-sm"
            layout
            transition={{
              type: "spring",
              bounce: 0.1,
            }}
          />
        </div>
      </div>
      <WaitlistDailog
        waitlistOpen={waitlistOpen}
        setWaitlistOpen={setWaitlistOpen}
      />
    </>
  );
};

const BuildView = ({
  input,
  setInput,
  onSubmit,
  loading,
  onFocus,
}: {
  input: string;
  setInput: (input: string) => void;
  onSubmit: () => void;
  loading: boolean;
  onFocus: () => void;
}) => {
  return (
    <ChatTextarea
      className="w-[calc(100dvw-12px)] md:w-lg"
      input={input}
      setInput={setInput}
      onSubmit={onSubmit}
      loading={loading}
      onFocus={onFocus}
    />
  );
};

const PlayView = () => {
  return (
    <section className="grid h-[80dvh] grid-cols-1 gap-10 overflow-auto p-3 md:grid-cols-2">
      {featuredGames.map((data) => {
        return (
          <Link
            key={data.id}
            href={`https://${data.slug}.vibedgames.com`}
            className="flex justify-center"
          >
            <Card {...data} />
          </Link>
        );
      })}
      <footer className="text-muted-foreground relative col-span-2 mt-auto flex flex-col gap-2 overflow-hidden pt-10 pb-10 text-center text-sm font-medium tracking-[-0.2px]">
        <div>
          made with{" "}
          <a className="text-white" href="https://vibedgames.com/">
            vibedgames
          </a>
        </div>
        <div className="flex justify-center gap-2">
          <a
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer noopener"
            href="https://github.com/kyh/vibedgames"
            className="rounded-full fill-white p-2 transition hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 32 32">
              <path d="M16.003,0C7.17,0,0.008,7.162,0.008,15.997  c0,7.067,4.582,13.063,10.94,15.179c0.8,0.146,1.052-0.328,1.052-0.752c0-0.38,0.008-1.442,0-2.777  c-4.449,0.967-5.371-2.107-5.371-2.107c-0.727-1.848-1.775-2.34-1.775-2.34c-1.452-0.992,0.109-0.973,0.109-0.973  c1.605,0.113,2.451,1.649,2.451,1.649c1.427,2.443,3.743,1.737,4.654,1.329c0.146-1.034,0.56-1.739,1.017-2.139  c-3.552-0.404-7.286-1.776-7.286-7.906c0-1.747,0.623-3.174,1.646-4.292C7.28,10.464,6.73,8.837,7.602,6.634  c0,0,1.343-0.43,4.398,1.641c1.276-0.355,2.645-0.532,4.005-0.538c1.359,0.006,2.727,0.183,4.005,0.538  c3.055-2.07,4.396-1.641,4.396-1.641c0.872,2.203,0.323,3.83,0.159,4.234c1.023,1.118,1.644,2.545,1.644,4.292  c0,6.146-3.74,7.498-7.304,7.893C19.479,23.548,20,24.508,20,26c0,2,0,3.902,0,4.428c0,0.428,0.258,0.901,1.07,0.746  C27.422,29.055,32,23.062,32,15.997C32,7.162,24.838,0,16.003,0z" />
            </svg>
          </a>
          <a
            aria-label="Twitter"
            target="_blank"
            rel="noreferrer noopener"
            href="https://x.com/kaiyuhsu"
            className="rounded-full fill-white p-2 transition hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 39 32">
              <path d="M0 28.384q0.96 0.096 1.92 0.096 5.632 0 10.048-3.456-2.624-0.032-4.704-1.6t-2.848-4q0.64 0.128 1.504 0.128 1.12 0 2.144-0.288-2.816-0.544-4.64-2.784t-1.856-5.12v-0.096q1.696 0.96 3.68 0.992-1.664-1.088-2.624-2.88t-0.992-3.84q0-2.176 1.12-4.064 3.008 3.744 7.36 5.952t9.28 2.496q-0.224-1.056-0.224-1.856 0-3.328 2.368-5.696t5.728-2.368q3.488 0 5.888 2.56 2.784-0.576 5.12-1.984-0.896 2.912-3.52 4.48 2.336-0.288 4.608-1.28-1.536 2.4-4 4.192v1.056q0 3.232-0.928 6.464t-2.88 6.208-4.64 5.28-6.432 3.68-8.096 1.344q-6.688 0-12.384-3.616z" />
            </svg>
          </a>
        </div>
        <div className="pointer-events-none absolute bottom-0 h-[300px] w-full translate-y-full rounded-full bg-gradient-to-tr from-[rgba(47,0,255,0.2)] to-[rgba(255,0,0,1)] blur-[62px]" />
      </footer>
    </section>
  );
};
