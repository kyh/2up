import React from "react";
import graphql from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay/hooks";
import { useParams } from "react-router-dom";
import { useAlert } from "react-alert";
import { ConnectionHandler, ROOT_ID } from "relay-runtime";
import { useFragment } from "react-relay/hooks";

import { useMutation } from "utils/useMutation";
import { Button } from "components";

import { ProfileUserQuery } from "./__generated__/ProfileUserQuery.graphql";
import { ProfilePackCreateMutation } from "./__generated__/ProfilePackCreateMutation.graphql";
import { Profile_packs$key } from "./__generated__/Profile_packs.graphql";

const UserQuery = graphql`
  query ProfileUserQuery($username: String!) {
    currentUser {
      username
    }
    ...Profile_packs @arguments(username: $username)
  }
`;

const packCreateMutation = graphql`
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
  const alert = useAlert();
  const { username } = useParams();

  const data = useLazyLoadQuery<ProfileUserQuery>(UserQuery, {
    username: username || "",
  });

  const [packCreate, isCreatingPack] = useMutation<ProfilePackCreateMutation>(
    packCreateMutation
  );

  const createPack = () => {
    packCreate({
      variables: {
        input: {
          name: "hi",
          description: "Some description",
          isRandom: true,
          length: 10,
        },
      },
      updater: (store) => {
        const payload = store.getRootField("packCreate");
        const pack = payload?.getLinkedRecord("pack");
        const root = store.get(ROOT_ID)!;
        const packs = ConnectionHandler.getConnection(root, "Profile_packs")!;
        const edge = ConnectionHandler.createEdge(
          store,
          packs,
          pack,
          "PackEdge"
        );
        ConnectionHandler.insertEdgeAfter(packs, edge);
      },
      onCompleted: (data) => {
        console.log("data", data);
      },
      onError: (error: Error) => {
        alert.show(error.message);
      },
    });
  };

  if (!data) {
    return null;
  }

  return (
    <div>
      <div>
        <p>{username}</p>
      </div>
      <div>
        <Button onClick={createPack} disabled={isCreatingPack}>
          Create pack
        </Button>
        <p>packs</p>
        <PackList packs={data} />
      </div>
    </div>
  );
};

type PackListProps = {
  packs: Profile_packs$key;
};

const PackList = ({ packs }: PackListProps) => {
  const data = useFragment(
    graphql`
      fragment Profile_packs on RootQueryType
        @argumentDefinitions(username: { type: "String!" }) {
        packs(first: 100, username: $username)
          @connection(key: "Profile_packs", filters: []) {
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
    `,
    packs
  );

  const edges = data?.packs?.edges || [];

  return (
    <>
      {edges.map((edge) => (
        <div key={edge?.node?.id}>
          <p>{edge?.node?.name}</p>
        </div>
      ))}
    </>
  );
};
