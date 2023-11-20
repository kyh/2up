import { Game } from "./game";

export const runtime = "edge";

const Page = ({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) => {
  const code = searchParams?.code?.toString();

  if (!code) {
    return null;
  }

  return (
    <main className="mx-auto max-w-lg py-8">
      <Game code={code} />
    </main>
  );
};

export default Page;
