/* tslint:disable */
/* eslint-disable */
<<<<<<< HEAD:client/src/features/gamemaster/__generated__/PackDiscoverPageQuery.graphql.ts
/* @relayHash 5a9ed42802c3e7d13c411560c9e169a7 */

import { ConcreteRequest } from "relay-runtime";
export type PackDiscoverPageQueryVariables = {};
export type PackDiscoverPageQueryResponse = {
=======
/* @relayHash a324340e85b04031d640410107cf2f61 */

import { ConcreteRequest } from "relay-runtime";
export type PackDiscoverPagePacksQueryVariables = {};
export type PackDiscoverPagePacksQueryResponse = {
>>>>>>> Fix discover page gql:client/src/features/gamemaster/__generated__/PackDiscoverPagePacksQuery.graphql.ts
    readonly packs: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly name: string;
            } | null;
        } | null> | null;
    } | null;
};
<<<<<<< HEAD:client/src/features/gamemaster/__generated__/PackDiscoverPageQuery.graphql.ts
export type PackDiscoverPageQuery = {
    readonly response: PackDiscoverPageQueryResponse;
    readonly variables: PackDiscoverPageQueryVariables;
=======
export type PackDiscoverPagePacksQuery = {
    readonly response: PackDiscoverPagePacksQueryResponse;
    readonly variables: PackDiscoverPagePacksQueryVariables;
>>>>>>> Fix discover page gql:client/src/features/gamemaster/__generated__/PackDiscoverPagePacksQuery.graphql.ts
};



/*
<<<<<<< HEAD:client/src/features/gamemaster/__generated__/PackDiscoverPageQuery.graphql.ts
query PackDiscoverPageQuery {
=======
query PackDiscoverPagePacksQuery {
>>>>>>> Fix discover page gql:client/src/features/gamemaster/__generated__/PackDiscoverPagePacksQuery.graphql.ts
  packs(first: 5) {
    edges {
      node {
        id
        name
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "packs",
    "storageKey": "packs(first:5)",
    "args": [
      {
        "kind": "Literal",
        "name": "first",
        "value": 5
      }
    ],
    "concreteType": "PackConnection",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "edges",
        "storageKey": null,
        "args": null,
        "concreteType": "PackEdge",
        "plural": true,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "node",
            "storageKey": null,
            "args": null,
            "concreteType": "Pack",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
<<<<<<< HEAD:client/src/features/gamemaster/__generated__/PackDiscoverPageQuery.graphql.ts
    "name": "PackDiscoverPageQuery",
=======
    "name": "PackDiscoverPagePacksQuery",
>>>>>>> Fix discover page gql:client/src/features/gamemaster/__generated__/PackDiscoverPagePacksQuery.graphql.ts
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
<<<<<<< HEAD:client/src/features/gamemaster/__generated__/PackDiscoverPageQuery.graphql.ts
    "name": "PackDiscoverPageQuery",
=======
    "name": "PackDiscoverPagePacksQuery",
>>>>>>> Fix discover page gql:client/src/features/gamemaster/__generated__/PackDiscoverPagePacksQuery.graphql.ts
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
<<<<<<< HEAD:client/src/features/gamemaster/__generated__/PackDiscoverPageQuery.graphql.ts
    "name": "PackDiscoverPageQuery",
    "id": null,
    "text": "query PackDiscoverPageQuery {\n  packs(first: 5) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n",
=======
    "name": "PackDiscoverPagePacksQuery",
    "id": null,
    "text": "query PackDiscoverPagePacksQuery {\n  packs(first: 5) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n",
>>>>>>> Fix discover page gql:client/src/features/gamemaster/__generated__/PackDiscoverPagePacksQuery.graphql.ts
    "metadata": {}
  }
};
})();
<<<<<<< HEAD:client/src/features/gamemaster/__generated__/PackDiscoverPageQuery.graphql.ts
(node as any).hash = 'a4552026bc1342372c5213312619a12a';
=======
(node as any).hash = '07653959df3a30de8f046e1c93da0eaa';
>>>>>>> Fix discover page gql:client/src/features/gamemaster/__generated__/PackDiscoverPagePacksQuery.graphql.ts
export default node;
