/* tslint:disable */
/* eslint-disable */
/* @relayHash 03fa6730a6dde5a60bb24a694340889a */

import { ConcreteRequest } from "relay-runtime";
export type GameInput = {
    code: string;
};
export type HomeGameCheckMutationVariables = {
    input: GameInput;
};
export type HomeGameCheckMutationResponse = {
  readonly game: {
    readonly isValid: boolean;
  } | null;
};
export type HomeGameCheckMutation = {
  readonly response: HomeGameCheckMutationResponse;
  readonly variables: HomeGameCheckMutationVariables;
};

/*
mutation HomeGameCheckMutation(
  $input: GameInput!
) {
  game(input: $input) {
    isValid
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "GameInput!",
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
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "GamePayload",
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
    "name": "HomeGameCheckMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeGameCheckMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "HomeGameCheckMutation",
    "id": null,
    "text": "mutation HomeGameCheckMutation(\n  $input: GameInput!\n) {\n  game(input: $input) {\n    isValid\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'cf7a936043205bbdcc1e23caeda65b8d';
export default node;
