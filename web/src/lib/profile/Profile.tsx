import styled from "styled-components";
import { useRouter } from "next/router";
import { theme } from "~/styles/theme";
import { ButtonLinkNative, Spinner } from "~/components";
import { Content } from "~/lib/packs/components/Page";
import { PackSection, Pack } from "~/lib/packs/components/Packs";
import { useGetPacks } from "~/lib/packs/usePackActions";
import { useAuth } from "~/lib/auth/useAuth";

export const Profile = () => {
  const auth = useAuth();
  const router = useRouter();
  const username = router.query.username as string;
  const res = useGetPacks({ username });

  if (!res.data) return <Spinner center />;

  const isMyPage = username === auth.user?.user_metadata.username;

  return (
    <ProfileContent>
      <header className="profile-header">
        <h1>@{username}&apos;s packs</h1>
        {isMyPage && (
          <ButtonLinkNative href="/packs/new">Create new Pack</ButtonLinkNative>
        )}
      </header>
      <PackSection>
        <div className="pack-items">
          {res.data.map((pack) => (
            <Pack
              key={pack.id}
              pack={pack}
              showEditButton={isMyPage}
              showPlayButton={!isMyPage}
            />
          ))}
        </div>
      </PackSection>
    </ProfileContent>
  );
};

const ProfileContent = styled(Content)`
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacings(5)};
  }
`;
