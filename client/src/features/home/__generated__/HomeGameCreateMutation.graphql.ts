/* tslint:disable */
/* eslint-disable */
/* @relayHash 711a8d4a2a9ada498ecb182fc39d5ebd */

import { ConcreteRequest } from "relay-runtime";
export type GameCreateInput = {
    pack: string;
};
export type HomeGameCreateMutationVariables = {
    input: GameCreateInput;
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
    "text": "mutation HomeGameCreateMutation(\n  $input: GameCreateInput!\n) {\n  gameCreate(input: $input) {\n    code\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'ba8d61c6af11964f8410c7aa9c1cefca';
export default node;
