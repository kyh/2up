import React from "react";
import styled from "styled-components";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { useForm } from "react-hook-form";

import { Button, Card, TextField, AreaField } from "components";
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

export type PackInputs = {
  name: string;
  description: string;
  isRandom?: boolean;
  length?: number;
};

export const PackNewPage = () => {
  const alert = useAlert();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<PackInputs>();

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
          <form onSubmit={handleSubmit(createPack)}>
            <TextField
              labelText="Pack Name"
              id="name"
              name="name"
              placeholder="Who's that Pokemon?"
              ref={register({ required: true })}
              error={!!errors.name}
              errorText="Pack name is required"
            />
            <AreaField
              labelText="Description"
              id="description"
              name="description"
              placeholder="The popular question-and-answer segment that is featured in numerous episodes of the Pokémon anime"
              ref={register({ required: true })}
              error={!!errors.description}
              errorText="A short description is required"
            />
            <Button className="submit" type="submit" disabled={loading}>
              Create Pack
            </Button>
          </form>
        </Card>
      </PackNewPageContent>
    </Page>
  );
};

const PackNewPageContent = styled(Content)`
  display: block;
  max-width: 500px;
  margin: 0 auto;

  form {
    display: flex;
    flex-direction: column;
  }

  input,
  textarea {
    width: 100%;
  }

  button {
    margin: 0 auto;
  }
`;
