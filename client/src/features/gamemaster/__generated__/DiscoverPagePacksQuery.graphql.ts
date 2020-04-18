/* tslint:disable */
/* eslint-disable */
/* @relayHash 34b3e2bba16813c3dcbf27a5b223fbeb */

import { ConcreteRequest } from "relay-runtime";
export type DiscoverPagePacksQueryVariables = {};
export type DiscoverPagePacksQueryResponse = {
    readonly packs: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly name: string;
            } | null;
        } | null> | null;
    } | null;
};
export type DiscoverPagePacksQuery = {
    readonly response: DiscoverPagePacksQueryResponse;
    readonly variables: DiscoverPagePacksQueryVariables;
};



/*
query DiscoverPagePacksQuery {
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
    "name": "DiscoverPagePacksQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "DiscoverPagePacksQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "DiscoverPagePacksQuery",
    "id": null,
    "text": "query DiscoverPagePacksQuery {\n  packs(first: 5) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '7632fbeb68d37a983e835d09c35078c9';
export default node;
