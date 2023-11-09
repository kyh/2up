import { useRouter } from "next/navigation";
import { Navigation } from "@/lib/game/components/navigation";
import { useConnectGame } from "@/lib/game/use-connect-game";

export const GameLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const gameId = router.query.gameId as string;

  const { isLoaded } = useConnectGame(gameId);

  if (!isLoaded) return null;

  return (
    <>
      <Navigation />
      <section className="mx-auto mt-[-50px] h-screen max-w-[600px] px-4">
        {children}
      </section>
    </>
  );
};
