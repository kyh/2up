import graphql from 'babel-plugin-relay/macro';
import { useRelayEnvironment } from 'react-relay/hooks';
import { commitMutation } from 'react-relay';

import {
  GameCheckMutationVariables,
  GameCheckMutation,
  GameCheckMutationResponse
} from './__generated__/GameCheckMutation.graphql';

const GameCheckMutation = graphql`
  mutation GameCheckMutation($code: String!) {
    game(code: $code) {
      isValid
    }
  }
`;

type GameCheckConfig = {
  variables: GameCheckMutationVariables;
  onCompleted(response: GameCheckMutationResponse, errors: any): void;
  onError?(error: any): void;
}

export const useGameCheck = () => {
  const environment = useRelayEnvironment();

  return ({ variables, onCompleted, onError }: GameCheckConfig) => {
    commitMutation<GameCheckMutation>(
      environment,
      {
        mutation: GameCheckMutation,
        variables,
        onCompleted,
        onError
      },
    );
  }
}

