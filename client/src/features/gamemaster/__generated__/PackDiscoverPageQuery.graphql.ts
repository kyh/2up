/* tslint:disable */
/* eslint-disable */
/* @relayHash bd951172825ecd77b8d9a96bbdfc56e6 */

import { ConcreteRequest } from "relay-runtime";
export type PackDiscoverPageQueryVariables = {};
export type PackDiscoverPageQueryResponse = {
    readonly packs: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly name: string;
                readonly description: string | null;
                readonly imageUrl: string | null;
            } | null;
        } | null> | null;
    } | null;
};
export type PackDiscoverPageQuery = {
    readonly response: PackDiscoverPageQueryResponse;
    readonly variables: PackDiscoverPageQueryVariables;
};



/*
query PackDiscoverPageQuery {
  packs(first: 5) {
    edges {
      node {
        id
        name
        description
        imageUrl
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "description",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "imageUrl",
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
    "name": "PackDiscoverPageQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PackDiscoverPageQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "PackDiscoverPageQuery",
    "id": null,
    "text": "query PackDiscoverPageQuery {\n  packs(first: 5) {\n    edges {\n      node {\n        id\n        name\n        description\n        imageUrl\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '2070cd5729d809eeeaa65f24d1107bcf';
export default node;
