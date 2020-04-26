/* tslint:disable */
/* eslint-disable */
/* @relayHash bf48200e5d68fc7720c978d15532c72f */

import { ConcreteRequest } from "relay-runtime";
export type PackDetailsPagePackQueryVariables = {
    packId: string;
};
export type PackDetailsPagePackQueryResponse = {
    readonly currentUser: {
        readonly id: string;
    } | null;
    readonly pack: {
        readonly id: string;
        readonly name: string;
        readonly description: string | null;
        readonly imageUrl: string | null;
        readonly user: {
            readonly id: string;
        };
    } | null;
};
export type PackDetailsPagePackQuery = {
    readonly response: PackDetailsPagePackQueryResponse;
    readonly variables: PackDetailsPagePackQueryVariables;
};



/*
query PackDetailsPagePackQuery(
  $packId: ID!
) {
  currentUser {
    id
  }
  pack(id: $packId) {
    id
    name
    description
    imageUrl
    user {
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "packId",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
],
v3 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "currentUser",
    "storageKey": null,
    "args": null,
    "concreteType": "User",
    "plural": false,
    "selections": (v2/*: any*/)
  },
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "pack",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "packId"
      }
    ],
    "concreteType": "Pack",
    "plural": false,
    "selections": [
      (v1/*: any*/),
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
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "user",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": (v2/*: any*/)
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PackDetailsPagePackQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PackDetailsPagePackQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "PackDetailsPagePackQuery",
    "id": null,
    "text": "query PackDetailsPagePackQuery(\n  $packId: ID!\n) {\n  currentUser {\n    id\n  }\n  pack(id: $packId) {\n    id\n    name\n    description\n    imageUrl\n    user {\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '58e7225fbee4598b279b71c02d249245';
export default node;
