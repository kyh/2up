import { redirect } from "next/navigation";

import { api } from "@/trpc/server";

export async function loadTeamPagePageData() {
  const { accounts } = await api.account.userWorkspace();
  const slug = accounts?.[0]?.slug ?? "";

  if (!slug) {
    return redirect("/account");
  }

  const { account, user } = await api.teamAccount.teamWorkspace({ slug });

  if (!account) {
    return redirect("/account");
  }

  const members = await api.teamAccount.members({ slug });
  const invitations = await api.teamAccount.invitations({ slug });

  return {
    account,
    user,
    members: members ?? [],
    invitations: invitations ?? [],
  };
}
