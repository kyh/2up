import React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

import { Button } from "components";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackCreateMutation } from "./__generated__/PackCreateMutation";

const PACK_CREATE = gql`
  mutation PackCreateMutation($input: PackCreateInput!) {
    packCreate(input: $input) {
      pack {
        id
        name
      }
    }
  }
`;

export const PackNewPage = () => {
  const alert = useAlert();
  const history = useHistory();
  const [packCreate, { loading }] = useMutation<PackCreateMutation>(
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
      history.push(`/packs/${pack?.id}/edit`);
    } catch (error) {
      alert.show(error.message);
    }
  };

  return (
    <Page>
      <Navigation />
      <PackNewPageContent>
        <Button onClick={createPack} disabled={loading}>
          Create Pack
        </Button>
      </PackNewPageContent>
    </Page>
  );
};

const PackNewPageContent = styled(Content)`
  display: block;
`;
