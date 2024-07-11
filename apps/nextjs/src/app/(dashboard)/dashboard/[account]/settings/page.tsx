import { redirect } from "next/navigation";

import { api } from "@/trpc/server";
import { TeamAccountDangerZone } from "./_components/team-account-danger-zone";
import { UpdateTeamAccountImage } from "./_components/update-team-account-image-container";
import { UpdateTeamAccountNameForm } from "./_components/update-team-account-name-form";

interface Params {
  account: string;
}

const Page = async ({ params }: { params: Params }) => {
  const { account } = await api.team.teamWorkspace({
    slug: params.account,
  });

  if (!account) {
    return redirect("/dashboard");
  }

  return (
    <>
      <section>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Team Logo
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Update your team's logo to make it easier to identify
            </p>
          </div>
          <div className="md:col-span-2">
            <UpdateTeamAccountImage
              account={{
                id: account.id,
                name: account.name,
                pictureUrl: account.picture_url,
              }}
            />
          </div>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Team Name
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Update your team's name
            </p>
          </div>
          <div className="md:col-span-2">
            <UpdateTeamAccountNameForm
              account={{
                name: account.name,
                slug: account.slug,
              }}
            />
          </div>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Danger Zone
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              This section contains actions that are irreversible
            </p>
          </div>
          <div className="md:col-span-2">
            <TeamAccountDangerZone
              primaryOwnerUserId={account.primary_owner_user_id}
              account={account}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
