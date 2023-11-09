import { useRouter } from "next/navigation";
import { ButtonLinkNative, Spinner } from "@/components";
import { Content } from "@/lib/packs/components/page";
import {
  PackSection,
  PackItemsContainer,
  Pack,
} from "@/lib/packs/components/packs";
import { useGetPacks } from "@/lib/packs/use-pack-actions";
import { useAuth } from "@/lib/auth/use-auth";

export const Profile = () => {
  const auth = useAuth();
  const router = useRouter();
  const username = router.query.username as string;
  const res = useGetPacks({ username });

  if (!res.data) return <Spinner />;

  const isMyPage = username === auth.user?.user_metadata.username;

  return (
    <Content>
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-3xl font-bold">@{username}&apos;s packs</h1>
        {isMyPage && (
          <ButtonLinkNative href="/packs/new">Create new Pack</ButtonLinkNative>
        )}
      </header>
      <section>
        <PackItemsContainer>
          {res.data.map((pack) => (
            <Pack
              key={pack.id}
              pack={pack}
              showEditButton={isMyPage}
              showPlayButton={!isMyPage}
            />
          ))}
        </PackItemsContainer>
      </section>
    </Content>
  );
};
