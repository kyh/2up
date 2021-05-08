import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

import { Card } from "components";
import { Navigation } from "features/packs/components/Navigation";
import { Page, Content } from "features/packs/components/Page";
import { PackForm } from "features/packs/components/PackForm";

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

export type PackInputs = {
  name: string;
  description: string;
  isRandom?: boolean;
  length?: number;
};

export const PackNewPage = () => {
  const alert = useAlert();
  const history = useHistory();

  const [packCreate, { loading }] = useMutation<PackCreateMutation>(
    PACK_CREATE
  );

  const createPack = async ({
    name,
    description,
    isRandom = true,
    length = 10,
  }: PackInputs) => {
    try {
      const response = await packCreate({
        variables: {
          input: {
            name,
            description,
            isRandom,
            length,
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
        <h1 className="title">New Pack</h1>
        <Card background>
          <PackForm onSubmit={createPack} loading={loading} />
        </Card>
      </PackNewPageContent>
    </Page>
  );
};

const PackNewPageContent = styled(Content)`
  display: block;
  max-width: 500px;
  margin: 0 auto;
`;
