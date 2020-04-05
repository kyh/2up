/* tslint:disable */
/* eslint-disable */
/* @relayHash c5f4063cff0b42b5637e8dabc800ed9c */

import { ConcreteRequest } from "relay-runtime";
export type GameCheckMutationVariables = {
    code: string;
};
export type GameCheckMutationResponse = {
    readonly game: {
        readonly isValid: boolean;
    } | null;
};
export type GameCheckMutation = {
    readonly response: GameCheckMutationResponse;
    readonly variables: GameCheckMutationVariables;
};



/*
mutation GameCheckMutation(
  $code: String!
) {
  game(code: $code) {
    isValid
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "code",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "game",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "code",
        "variableName": "code"
      }
    ],
    "concreteType": "Game",
    "plural": false,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "isValid",
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
    "name": "GameCheckMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameCheckMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "GameCheckMutation",
    "id": null,
    "text": "mutation GameCheckMutation(\n  $code: String!\n) {\n  game(code: $code) {\n    isValid\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '9660e7439127aefe5847b2a5f912d721';
export default node;
