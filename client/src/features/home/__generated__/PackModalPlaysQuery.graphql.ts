/* tslint:disable */
/* eslint-disable */
/* @relayHash 9c54b33ac6244f99f7936295ff73c430 */

import { ConcreteRequest } from "relay-runtime";
export type PackModalPlaysQueryVariables = {};
export type PackModalPlaysQueryResponse = {
    readonly packs: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly name: string;
            } | null;
        } | null> | null;
    } | null;
};
export type PackModalPlaysQuery = {
    readonly response: PackModalPlaysQueryResponse;
    readonly variables: PackModalPlaysQueryVariables;
};



/*
query PackModalPlaysQuery {
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
    "name": "PackModalPlaysQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PackModalPlaysQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "PackModalPlaysQuery",
    "id": null,
    "text": "query PackModalPlaysQuery {\n  packs(first: 5) {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'b9817dda037020e3bb9209b1efe20caf';
export default node;
