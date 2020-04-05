import graphql from 'babel-plugin-relay/macro';
import { useRelayEnvironment } from 'react-relay/hooks';
import { commitMutation } from 'react-relay';

import {
  GameNewMutationVariables,
  GameNewMutation,
  GameNewMutationResponse
} from './__generated__/GameNewMutation.graphql';

const GameNewMutation = graphql`
  mutation GameNewMutation($pack: String!) {
    gameNew(pack: $pack) {
      code
    }
  }
`;

type GameNewConfig = {
  variables: GameNewMutationVariables;
  onCompleted(response: GameNewMutationResponse): void;
  onError(error: any): void;
}

export const useGameNew = () => {
  const environment = useRelayEnvironment();

  return ({ variables, onCompleted, onError }: GameNewConfig) => {
    commitMutation<GameNewMutation>(
      environment,
      {
        mutation: GameNewMutation,
        variables,
        onCompleted,
        onError
      },
    );
  }
}
