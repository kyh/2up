/* tslint:disable */
/* eslint-disable */
/* @relayHash e50c86b74ac3407b1b718da1f61d12f1 */

import { ConcreteRequest } from "relay-runtime";
export type GameNewMutationVariables = {
    pack: string;
};
export type GameNewMutationResponse = {
    readonly gameNew: {
        readonly code: string;
    } | null;
};
export type GameNewMutation = {
    readonly response: GameNewMutationResponse;
    readonly variables: GameNewMutationVariables;
};



/*
mutation GameNewMutation(
  $pack: String!
) {
  gameNew(pack: $pack) {
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
    "name": "gameNew",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "pack",
        "variableName": "pack"
      }
    ],
    "concreteType": "Code",
    "plural": false,
    "selections": [
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
    "name": "GameNewMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameNewMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "GameNewMutation",
    "id": null,
    "text": "mutation GameNewMutation(\n  $pack: String!\n) {\n  gameNew(pack: $pack) {\n    code\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '6b99b1a87a24fe9794a19085d820cfbd';
export default node;
