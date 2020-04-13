/* tslint:disable */
/* eslint-disable */
/* @relayHash 2490d4b3f884b3c5132ee55fd1169af7 */

import { ConcreteRequest } from "relay-runtime";
export type PackCreateInput = {
    name: string;
};
export type PackNewPackCreateMutationVariables = {
    input: PackCreateInput;
};
export type PackNewPackCreateMutationResponse = {
    readonly packCreate: {
        readonly pack: {
            readonly id: string;
            readonly name: string;
        };
    } | null;
};
export type PackNewPackCreateMutation = {
    readonly response: PackNewPackCreateMutationResponse;
    readonly variables: PackNewPackCreateMutationVariables;
};



/*
mutation PackNewPackCreateMutation(
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
    "name": "PackNewPackCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PackNewPackCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "PackNewPackCreateMutation",
    "id": null,
    "text": "mutation PackNewPackCreateMutation(\n  $input: PackCreateInput!\n) {\n  packCreate(input: $input) {\n    pack {\n      id\n      name\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '3bd3f897e8fe40af4dd50a3d9b934495';
export default node;
