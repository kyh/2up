import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Card } from "components";
import { Navigation } from "features/packs/components/Navigation";
import { Page, Content } from "features/packs/components/Page";
import { PackForm, PackFormInputs } from "features/packs/components/PackForm";

import { PackNewPagePackCreateMutation } from "./__generated__/PackNewPagePackCreateMutation";

export const PackNewPage = () => {
  const defaultPackValues = { isRandom: true, length: 10 };
  const alert = useAlert();
  const history = useHistory();
  const [packCreate, { loading }] =
    useMutation<PackNewPagePackCreateMutation>(PACK_CREATE);

  const createPack = async (newPack: PackFormInputs) => {
    try {
      const response = await packCreate({
        variables: {
          input: { ...newPack },
        },
      });
      const pack = response.data?.packCreate?.pack;
      if (pack) {
        history.push(`/packs/${pack.id}/edit`);
      }
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
          <PackForm
            onSubmit={createPack}
            loading={loading}
            defaultValues={defaultPackValues}
          />
        </Card>
      </PackNewPageContent>
    </Page>
  );
};

const PACK_CREATE = gql`
  mutation PackNewPagePackCreateMutation($input: PackCreateInput!) {
    packCreate(input: $input) {
      pack {
        id
        name
      }
    }
  }
`;

const PackNewPageContent = styled(Content)`
  display: block;
  max-width: 500px;
  margin: 0 auto;
`;
