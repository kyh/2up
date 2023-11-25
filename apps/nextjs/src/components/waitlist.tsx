"use client";

import { useState } from "react";

import { api } from "@/lib/trpc/react";
import type { RouterOutputs } from "@/lib/trpc/react";

export const JoinWaitlistForm = () => {
  const utils = api.useUtils();

  const [email, setEmail] = useState("");

  const { mutateAsync, error } = api.waitlist.joinAccountWaitlist.useMutation({
    onSuccess: async () => {
      setEmail("");
      await utils.waitlist.all.invalidate();
    },
  });

  return (
    <form
      className="flex w-full max-w-2xl flex-col"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await mutateAsync({
            email,
          });
          setEmail("");
          await utils.waitlist.all.invalidate();
        } catch {
          // noop
        }
      }}
    >
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {error?.data?.zodError?.fieldErrors.email && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.email}
        </span>
      )}
      <button type="submit" className="rounded bg-pink-400 p-2 font-bold">
        Create
      </button>
    </form>
  );
};

export const WaitlistList = () => {
  const { data: waitlist } = api.waitlist.all.useQuery();

  if (waitlist?.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No waitlist yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {waitlist?.map((w) => {
        return <WaitlistCard key={w.id} waitlist={w} />;
      })}
    </div>
  );
};

export const WaitlistCard = (props: {
  waitlist: RouterOutputs["waitlist"]["all"][number];
}) => {
  const utils = api.useUtils();
  const deleteWaitlist = api.waitlist.delete.useMutation();

  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-pink-400">
          {(props.waitlist.data as { email: string }).email}
        </h2>
      </div>
      <div>
        <button
          className="cursor-pointer text-sm font-bold uppercase text-pink-400"
          onClick={async () => {
            await deleteWaitlist.mutateAsync(props.waitlist.id);
            await utils.waitlist.all.invalidate();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
