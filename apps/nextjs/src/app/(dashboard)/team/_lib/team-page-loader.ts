import { redirect } from "next/navigation";

import { api } from "@/trpc/server";

export const loadTeamPagePageData = async (slug: string) => {
  const { account, user } = await api.team.teamWorkspace({ slug });

  if (!account) {
    return redirect("/account");
  }

  return {
    account,
    user,
  };
};
