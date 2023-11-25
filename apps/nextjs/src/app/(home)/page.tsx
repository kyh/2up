import { api } from "@/lib/trpc/server";
import { JoinGameForm } from "./_components/join";
import { Discover } from "./_components/packs";

export const runtime = "edge";

const Page = async () => {
  const packsBySection = await api.pack.getDiscover.query();

  return (
    <main className="space-y-5">
      <JoinGameForm />
      <Discover packsBySection={packsBySection} />
    </main>
  );
};

export default Page;
