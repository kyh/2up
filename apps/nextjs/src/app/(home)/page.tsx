import { createCallerApi } from "@2up/api/caller-api";

import { JoinGameForm } from "./_components/join";
import { Discover } from "./_components/packs";

export const runtime = "edge";

const Page = async () => {
  const api = await createCallerApi();

  const packsBySection = await api.pack.getDiscover();

  return (
    <main className="space-y-5">
      <JoinGameForm />
      <Discover packsBySection={packsBySection} />
    </main>
  );
};

export default Page;
