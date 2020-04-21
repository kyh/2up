/* tslint:disable */
/* eslint-disable */
/* @relayHash b3c06b8a7417ca0b06e3dcf5a09415d7 */

import { ConcreteRequest } from "relay-runtime";
export type GameCreateInput = {
    pack: string;
};
export type PackDetailsPageGameCreateMutationVariables = {
    input: GameCreateInput;
};
export type PackDetailsPageGameCreateMutationResponse = {
    readonly gameCreate: {
        readonly code: string;
    } | null;
};
export type PackDetailsPageGameCreateMutation = {
    readonly response: PackDetailsPageGameCreateMutationResponse;
    readonly variables: PackDetailsPageGameCreateMutationVariables;
};



/*
mutation PackDetailsPageGameCreateMutation(
  $input: GameCreateInput!
) {
  gameCreate(input: $input) {
    code
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "GameCreateInput!",
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
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "GameCreatePayload",
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
    "name": "PackDetailsPageGameCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PackDetailsPageGameCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "PackDetailsPageGameCreateMutation",
    "id": null,
    "text": "mutation PackDetailsPageGameCreateMutation(\n  $input: GameCreateInput!\n) {\n  gameCreate(input: $input) {\n    code\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '8c45438b26ccd7d8c7be02c7e3325696';
export default node;
