import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { theme } from "styles/theme";
import { ButtonLinkNative } from "components";
import { Navigation } from "features/packs/components/Navigation";
import { Page, Content } from "features/packs/components/Page";
import { PackSection, Pack } from "features/packs/components/Packs";
import { collectConnectionNodes } from "utils/collectionUtil";

import { ProfilePageUserQuery } from "./__generated__/ProfilePageUserQuery";

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { data } = useQuery<ProfilePageUserQuery>(USER_QUERY, {
    variables: { username: username || "" },
  });

  if (!data) {
    return null;
  }

  const packs = collectConnectionNodes(data.packs);
  const isMyPage = data?.currentUser?.username === username;

  return (
    <Page>
      <Navigation />
      <Content>
        <ProfileContent>
          <header className="profile-header">
            <h1>@{username}'s packs</h1>
            {isMyPage && (
              <ButtonLinkNative to="/packs/new">
                Create new Pack
              </ButtonLinkNative>
            )}
          </header>
          <PackSection>
            <div className="pack-items">
              {packs.map((pack) => (
                <Pack
                  key={pack.id}
                  pack={pack}
                  showEditButton
                  showPlayButton={false}
                />
              ))}
            </div>
          </PackSection>
        </ProfileContent>
      </Content>
    </Page>
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

const ProfileContent = styled.section`
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacings(5)};
  }
`;
