import React, { useState } from "react";
import { useAlert } from "react-alert";
import graphql from "babel-plugin-relay/macro";
import { Box, Input } from "components";
import { useMutation } from "utils/useMutation";

import { ActNewActCreateMutation } from "./__generated__/ActNewActCreateMutation.graphql";

const actCreateMutation = graphql`
  mutation ActNewActCreateMutation($input: ActCreateInput!) {
    actCreate(input: $input) {
      act {
        id
      }
    }
  }
`;

export const ActNew = () => {
  const alert = useAlert();
  const [order, setOrder] = useState<number | undefined>();

  const [actCreate, isCreatingAct] = useMutation<ActNewActCreateMutation>(
    actCreateMutation
  );

  const handleOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrder(parseInt(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    actCreate({
      variables: { input: { order } },
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
      <h1>Act New</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            order
            <Input type="number" value={order} onChange={handleOrderChange} />
          </label>
        </div>
        <Input type="submit" value="Submit" disabled={isCreatingAct} />
      </form>
    </Box>
  );
};
