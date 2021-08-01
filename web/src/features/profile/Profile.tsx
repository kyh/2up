import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { theme } from "styles/theme";
import { ButtonLinkNative } from "components";
import { Content } from "features/packs/components/Page";
import { PackSection, Pack } from "features/packs/components/Packs";
import { collectConnectionNodes } from "util/collection";

import { ProfilePageUserQuery } from "./__generated__/ProfilePageUserQuery";

export const Profile = () => {
  const router = useRouter();
  const username = router.query.username as string;
  const { data } = useQuery<ProfilePageUserQuery>(USER_QUERY, {
    variables: { username: username || "" },
  });

  if (!data) {
    return null;
  }

  const packsMap = collectConnectionNodes(data.packs);
  const packs = Object.values(packsMap);
  const isMyPage = data?.currentUser?.username === username;

  return (
    <ProfileContent>
      <header className="profile-header">
        <h1>@{username}'s packs</h1>
        {isMyPage && (
          <ButtonLinkNative to="/packs/new">Create new Pack</ButtonLinkNative>
        )}
      </header>
      <PackSection>
        <div className="pack-items">
          {packs.map((pack) => (
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

const USER_QUERY = gql`
  query ProfilePageUserQuery($username: String!) {
    currentUser {
      username
    }
    packs(first: 100, username: $username) {
      edges {
        node {
          id
          name
          imageUrl
          description
        }
      }
    }
  }
`;

const ProfileContent = styled(Content)`
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacings(5)};
  }
`;
