import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { Card } from "components";
import { Content } from "features/packs/components/Page";
import { PackForm, PackFormInputs } from "features/packs/components/PackForm";

import { PackNewPagePackCreateMutation } from "./__generated__/PackNewPagePackCreateMutation";

export const PackNew = () => {
  const alert = useAlert();
  const router = useRouter();
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
        router.push(`/packs/${pack.id}/edit`);
      }
    } catch (error) {
      alert.show(error.message);
    }
  };

  return (
    <PackNewPageContent>
      <h1 className="title">New Pack</h1>
      <Card background>
        <PackForm onSubmit={createPack} loading={loading} />
      </Card>
    </PackNewPageContent>
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
