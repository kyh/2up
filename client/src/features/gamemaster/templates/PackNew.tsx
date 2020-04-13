import React, { useState } from "react";
import { useAlert } from "react-alert";
import graphql from "babel-plugin-relay/macro";

import { Box, Input } from "components";
import { useMutation } from "utils/useMutation";

import { PackNewPackCreateMutation } from "./__generated__/PackNewPackCreateMutation.graphql";

const packCreateMutation = graphql`
  mutation PackNewPackCreateMutation($input: PackCreateInput!) {
    packCreate(input: $input) {
      pack {
        id
        name
      }
    }
  }
`;

export const PackNew = () => {
  const alert = useAlert();
  const [name, setName] = useState("");

  const [packCreate, isCreatingPack] = useMutation<PackNewPackCreateMutation>(
    packCreateMutation
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    packCreate({
      variables: { input: { name } },
      onCompleted: (data) => {
        console.log("data", data);
      },
      onError: (error: Error) => {
        alert.show(error.message);
      },
    });

    return false;
  };

  return (
    <Box>
      <h1>PackNew</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            name
            <Input value={name} onChange={handleNameChange} />
          </label>
        </div>
        <Input type="submit" value="Submit" disabled={isCreatingPack} />
      </form>
    </Box>
  );
};
