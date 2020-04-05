/* tslint:disable */
/* eslint-disable */
/* @relayHash a8c19e87c6ea212f7d6f2d4b8d49468f */

import { ConcreteRequest } from "relay-runtime";
export type HomeGameNewMutationVariables = {
    pack: string;
};
export type HomeGameNewMutationResponse = {
    readonly gameNew: {
        readonly code: string;
    } | null;
};
export type HomeGameNewMutation = {
    readonly response: HomeGameNewMutationResponse;
    readonly variables: HomeGameNewMutationVariables;
};



/*
mutation HomeGameNewMutation(
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
    "name": "HomeGameNewMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeGameNewMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "HomeGameNewMutation",
    "id": null,
    "text": "mutation HomeGameNewMutation(\n  $pack: String!\n) {\n  gameNew(pack: $pack) {\n    code\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '85e0e8f1d3f99291ee3969ba165db985';
export default node;
