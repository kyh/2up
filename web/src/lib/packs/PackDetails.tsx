import styled from "styled-components";
import { useRouter } from "next/router";
import { theme } from "~/styles/theme";
import { Link, Button, Spinner } from "~/components";
import { useHostGame } from "~/lib/game/useGameActions";
import { Content } from "~/lib/packs/components/Page";
import { useGetPack } from "~/lib/packs/usePackActions";
import { useAuth } from "~/lib/auth/useAuth";

export const PackDetails = () => {
  const auth = useAuth();
  const router = useRouter();
  const packId = router.query.packId as string;
  const { hostGame, isIdle } = useHostGame();
  const res = useGetPack(packId);

  if (!res.data) return <Spinner center />;

  const pack = res.data;

  return (
    <PackDetailsPageContent>
      <Link href="/packs" className="back-link">
        &#171; Back to packs
      </Link>
      {pack && (
        <header className="pack-header">
          <h1 className="pack-name">{pack.name}</h1>
          <p className="pack-description">{pack.description}</p>
          <div className="pack-actions">
            <Button onClick={() => hostGame(packId)} disabled={!isIdle}>
              Start a game
            </Button>
            {pack.userId === auth.user?.id && (
              <Link href={`/packs/${packId}/edit`}>Edit Pack</Link>
            )}
          </div>
        </header>
      )}
    </PackDetailsPageContent>
  );
};

const PackDetailsPageContent = styled(Content)`
  display: block;

  .pack-header {
    text-align: center;
    margin: auto;
    max-width: 600px;
  }

  .pack-description {
    margin-bottom: ${theme.spacings(5)};
  }

  .pack-actions {
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin-bottom: ${theme.spacings(2)};
      min-width: 150px;
    }

    a:hover {
      text-decoration: underline;
    }
  }
`;
