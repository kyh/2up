/* tslint:disable */
/* eslint-disable */
/* @relayHash f5974eb088c7557ff08d9ed96e84d6ea */

import { ConcreteRequest } from "relay-runtime";
export type PackCreateInput = {
    description: string;
    isRandom: boolean;
    length: number;
    name: string;
};
export type ProfilePackCreateMutationVariables = {
    input: PackCreateInput;
};
export type ProfilePackCreateMutationResponse = {
    readonly packCreate: {
        readonly pack: {
            readonly id: string;
            readonly name: string;
        };
    } | null;
};
export type ProfilePackCreateMutation = {
    readonly response: ProfilePackCreateMutationResponse;
    readonly variables: ProfilePackCreateMutationVariables;
};



/*
mutation ProfilePackCreateMutation(
  $input: PackCreateInput!
) {
  packCreate(input: $input) {
    pack {
      id
      name
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "PackCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "packCreate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "PackCreatePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "pack",
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
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ProfilePackCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ProfilePackCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ProfilePackCreateMutation",
    "id": null,
    "text": "mutation ProfilePackCreateMutation(\n  $input: PackCreateInput!\n) {\n  packCreate(input: $input) {\n    pack {\n      id\n      name\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '72027348f65a47be1ba7b4e2c5ec8adf';
export default node;
