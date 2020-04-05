import { useRelayEnvironment } from 'react-relay/hooks';
import { commitMutation } from 'react-relay';

import { MutationParameters, GraphQLTaggedNode, MutationConfig } from 'relay-runtime';

type BaseMutationConfig<TMutation extends MutationParameters> = Omit<MutationConfig<TMutation>, "mutation">;

export function useBaseMutation<TMutation extends MutationParameters>(mutation: GraphQLTaggedNode) {
  const environment = useRelayEnvironment();

  return (config: BaseMutationConfig<TMutation> & { mutation?: never }) => {
    commitMutation<TMutation>(
      environment,
      {
        mutation,
        variables: config.variables,
        onCompleted: config.onCompleted,
        onError: config.onError
      },
    );
  }
}
