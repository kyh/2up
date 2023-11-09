import { classed } from "@/lib/utils/classed";
import { useRouter } from "next/navigation";
import { Link, Button, Spinner } from "@/components";
import { useHostGame } from "@/lib/game/use-game-actions";
import { Content } from "@/lib/packs/components/page";
import { useGetPack } from "@/lib/packs/use-pack-actions";
import { useAuth } from "@/lib/auth/use-auth";

export const PackDetails = () => {
  const auth = useAuth();
  const router = useRouter();
  const packId = router.query.packId as string;
  const { hostGame, isLoading } = useHostGame();
  const res = useGetPack(packId);

  if (!res.data) return <Spinner />;

  const pack = res.data;

  return (
    <PackDetailsPageContent>
      <Link href="/packs" className="inline-block hover:underline">
        &#171; Back to packs
      </Link>
      {pack && (
        <header className="m-auto max-w-[600px] text-center">
          <h1 className="mb-3 text-3xl font-bold">{pack.name}</h1>
          <p className="mb-5">{pack.description}</p>
          <div className="flex flex-col items-center">
            <Button
              className="mb-2 min-w-[150px]"
              onClick={() => hostGame(packId)}
              disabled={isLoading}
            >
              Start a game
            </Button>
            {pack.userId === auth.user?.id && (
              <Link className="underline" href={`/packs/${packId}/edit`}>
                Edit Pack
              </Link>
            )}
          </div>
        </header>
      )}
    </PackDetailsPageContent>
  );
};

const PackDetailsPageContent = classed(Content, "block");
