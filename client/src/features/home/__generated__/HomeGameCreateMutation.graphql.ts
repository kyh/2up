/* tslint:disable */
/* eslint-disable */
/* @relayHash a01420efeef0c82f02452d6108e71340 */

import { ConcreteRequest } from "relay-runtime";
export type HomeGameCreateMutationVariables = {
    pack: string;
};
export type HomeGameCreateMutationResponse = {
    readonly gameCreate: {
        readonly code: string;
    } | null;
};
export type HomeGameCreateMutation = {
    readonly response: HomeGameCreateMutationResponse;
    readonly variables: HomeGameCreateMutationVariables;
};

/*
mutation HomeGameCreateMutation(
  $pack: String!
) {
  gameCreate(pack: $pack) {
    code
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "pack",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "gameCreate",
    "storageKey": null,
    "args": [
      {
        kind: "LocalArgument",
        name: "pack",
        type: "String!",
        defaultValue: null,
      },
    ],
    v1 = [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "code",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeGameCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeGameCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "HomeGameCreateMutation",
    "id": null,
    "text": "mutation HomeGameCreateMutation(\n  $pack: String!\n) {\n  gameCreate(pack: $pack) {\n    code\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '24b52d84a04cb316674dfbe4a338307e';
export default node;
