import styled from "styled-components";
import { gql, useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";

import { Navigation } from "features/packs/components/Navigation";
import { Page, Content } from "features/packs/components/Page";
import { PackSection } from "features/packs/components/Packs";

import { ButtonLinkNative } from "components";

import { ProfileUserQuery } from "./__generated__/ProfileUserQuery";

const USER_QUERY = gql`
  query ProfileUserQuery($username: String!) {
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

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { data } = useQuery<ProfileUserQuery>(USER_QUERY, {
    variables: { username: username || "" },
  });

  if (!data) {
    return null;
  }

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
              {data.packs?.edges?.map((edge) => {
                const pack = edge?.node;
                if (!pack) return null;

                return (
                  <div key={pack.id} className="pack-item">
                    <Link to={`/packs/${pack.id}`}>
                      <article>
                        <h2>{pack.name}</h2>
                        <p>{pack.description}</p>
                      </article>
                    </Link>
                    {isMyPage && (
                      <div className="edit-pack-footer">
                        <ButtonLinkNative to={`/packs/${pack.id}/edit`}>
                          Edit Pack
                        </ButtonLinkNative>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </PackSection>
        </ProfileContent>
      </Content>
    </Page>
  );
};

const ProfileContent = styled.section`
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacings(5)};
  }
`;
