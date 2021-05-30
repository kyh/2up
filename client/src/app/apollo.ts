import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  createHttpLink,
} from "@apollo/client";
import { OperationDefinitionNode } from "graphql";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getMainDefinition } from "apollo-utilities";
import { omitDeep } from "utils/stringUtils";

const cache = new InMemoryCache();

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  const keysToOmit = ["__typename"];
  const def = getMainDefinition(operation.query) as OperationDefinitionNode;
  if (def && def.operation === "mutation") {
    operation.variables = omitDeep(operation.variables, ...keysToOmit);
  }
  return forward ? forward(operation) : null;
});

// TODO: We should use http cookies instead
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
});

export const client = new ApolloClient({
  cache: cache,
  link: ApolloLink.from([cleanTypenameLink, authLink, errorLink, httpLink]),
  credentials: "include",
});
