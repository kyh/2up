import React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useParams, Link } from "react-router-dom";

import { Button, Card } from "components";

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

export const Profile = () => {
  const { username } = useParams();

  const { data, refetch } = useQuery<ProfileUserQuery>(USER_QUERY, {
    variables: { username: username || "" },
  });

  const [packCreate] = useMutation<ProfilePackCreateMutation>(PACK_CREATE);

  const createPack = async () => {
    await packCreate({
      variables: {
        input: {
          name: "hi",
          description: "Some description",
          isRandom: true,
          length: 10,
        },
      },
    });
    refetch();
  };

  if (!data) {
    return null;
  }

  return (
    <ProfileContainer>
      <h1>{username}</h1>
      <h2>Packs</h2>
      <Button onClick={createPack}>Create pack</Button>
      {data.packs?.edges?.map((edge) => {
        const node = edge?.node;
        const packId = node?.id;
        const packName = node?.name;

        return (
          <Card key={packId}>
            <h3>
              <Link to={`/gamemaster/${packId}`}>{packName}</Link>
            </h3>
            <Link to={`/gamemaster/${packId}/edit`}>Edit</Link>
          </Card>
        );
      })}
    </ProfileContainer>
  );
};

const ProfileContainer = styled.section`
  max-width: 750px;
  margin: 0 auto;
`;
