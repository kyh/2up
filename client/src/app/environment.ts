import { Environment, Network, RecordSource, Store } from "relay-runtime";

async function fetchGraphQL(text: string, variables: any) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  return await response.json();
}

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text.
function fetchRelay(params: any, variables: any) {
  console.log(
    `fetching query ${params.name} with ${JSON.stringify(variables)}`
  );
  return fetchGraphQL(params.text, variables);
}

// Export a singleton instance of Relay Environment configured with our network function:
export const environment = new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
