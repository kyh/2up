import { useState, useRef, useCallback, useEffect } from "react";
import { useRelayEnvironment } from "react-relay/hooks";
import { commitMutation } from "react-relay";

import {
  MutationParameters,
  GraphQLTaggedNode,
  MutationConfig,
  Disposable,
} from "relay-runtime";

type BaseMutationConfig<TMutation extends MutationParameters> = Omit<
  MutationConfig<TMutation>,
  "mutation"
>;

export function useMutation<TMutation extends MutationParameters>(
  mutation: GraphQLTaggedNode
) {
  const environment = useRelayEnvironment();
  const [isPending, setPending] = useState(false);
  const requestRef = useRef<null | Disposable>(null);
  const mountedRef = useRef(false);

  const execute = useCallback(
    (
      config: BaseMutationConfig<TMutation> & { mutation?: never } = {
        variables: {},
      }
    ) => {
      if (requestRef.current != null) {
        return;
      }
      const request = commitMutation<TMutation>(environment, {
        ...config,
        onCompleted: (...args) => {
          if (!mountedRef.current) {
            return;
          }
          requestRef.current = null;
          setPending(false);
          config.onCompleted && config.onCompleted(...args);
        },
        onError: (error) => {
          console.error(error);
          if (!mountedRef.current) {
            return;
          }
          requestRef.current = null;
          setPending(false);
          config.onError && config.onError(error);
        },
        mutation,
      });
      requestRef.current = request;
      setPending(true);
    },
    [mutation, environment]
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const response: [typeof execute, typeof isPending] = [execute, isPending];

  return response;
}
