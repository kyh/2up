import React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useParams, useHistory, Link } from "react-router-dom";
import { useAlert } from "react-alert";

import { Button } from "components";
import { Navigation } from "features/gamemaster/components/Navigation";
import { Page, Content } from "features/gamemaster/components/Page";
import {
  PackSection,
  DefaultImage,
} from "features/gamemaster/components/Packs";

import { ProfileUserQuery } from "./__generated__/ProfileUserQuery";
import { ProfilePackCreateMutation } from "./__generated__/ProfilePackCreateMutation";

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

const PACK_CREATE = gql`
  mutation ProfilePackCreateMutation($input: PackCreateInput!) {
    packCreate(input: $input) {
      pack {
        id
        name
      }
    }
  }
`;

export const ProfilePage = () => {
  const alert = useAlert();
  const history = useHistory();
  const { username } = useParams();
  const { data } = useQuery<ProfileUserQuery>(USER_QUERY, {
    variables: { username: username || "" },
  });
  const [packCreate, { loading }] = useMutation<ProfilePackCreateMutation>(
    PACK_CREATE
  );

  const createPack = async () => {
    try {
      const response = await packCreate({
        variables: {
          input: {
            name: "hi",
            description: "Some description",
            isRandom: true,
            length: 10,
          },
        },
      });
      const pack = response.data?.packCreate?.pack;
      history.push(`/gamemaster/${pack?.id}/edit`);
    } catch (error) {
      alert.show(error.message);
    }
  };

  if (!data) {
    return null;
  }

  return (
    <Page>
      <Navigation />
      <Content>
        <ProfileContent>
          <header className="profile-header">
            <h1>@{username}'s packs</h1>
            <Button onClick={createPack} disabled={loading}>
              Create Pack
            </Button>
          </header>
          <PackSection>
            <div className="pack-items">
              {data.packs?.edges?.map((edge) => {
                const pack = edge?.node;
                if (!pack) return null;

                return (
                  <div key={pack.id} className="pack-item">
                    <Link to={`/gamemaster/${pack.id}`}>
                      {pack.imageUrl ? (
                        <img src={pack.imageUrl || ""} alt={pack.name} />
                      ) : (
                        <DefaultImage />
                      )}
                      <h4>{pack.name}</h4>
                      <p>{pack.description}</p>
                    </Link>
                    <Link
                      className="edit-pack-button"
                      to={`/gamemaster/${pack.id}/edit`}
                    >
                      Edit Pack
                    </Link>
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
    margin-bottom: ${({ theme }) => theme.spacings(5)};
  }
`;