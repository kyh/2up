"use client";

import { useRouter } from "next/navigation";

import type { RouterOutputs } from "@2up/api";
import { api } from "@/trpc/react";

type PackSection = RouterOutputs["pack"]["discover"][number];
type Pack = PackSection["packs"][number];

export const Discover = ({
  packsBySection,
}: {
  packsBySection: PackSection[];
}) => {
  return packsBySection.map((packSection) => (
    <section key={packSection.title} className="space-y-1">
      <h2 className="text-2xl">{packSection.title}</h2>
      <div className="space-y-1">
        {packSection.packs.map((pack) => (
          <PackRow key={pack.id} pack={pack} />
        ))}
      </div>
    </section>
  ));
};

const PackRow = ({ pack }: { pack: Pack }) => {
  const router = useRouter();
  const { mutateAsync, isPending } = api.game.create.useMutation();

  const onCreateGame = async () => {
    if (!pack) return;
    const response = await mutateAsync({ packId: pack.id });
    router.push(`/game?code=${response.code}`);
  };

  return (
    <div className="flex w-full items-center justify-between text-sm">
      {pack.name}{" "}
      <button
        className="bg-gray-700 p-2 text-xs"
        onClick={onCreateGame}
        disabled={isPending}
      >
        Create Game
      </button>
    </div>
  );
};
