/* tslint:disable */
/* eslint-disable */
/* @relayHash c17bd897b93861264817e1d928bd3b1b */

import { ConcreteRequest } from "relay-runtime";
export type ActCreateInput = {
    order?: number | null;
};
export type ActNewActCreateMutationVariables = {
    input: ActCreateInput;
};
export type ActNewActCreateMutationResponse = {
    readonly actCreate: {
        readonly act: {
            readonly id: string;
        };
    } | null;
};
export type ActNewActCreateMutation = {
    readonly response: ActNewActCreateMutationResponse;
    readonly variables: ActNewActCreateMutationVariables;
};



/*
mutation ActNewActCreateMutation(
  $input: ActCreateInput!
) {
  actCreate(input: $input) {
    act {
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "ActCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "actCreate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ActCreatePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "act",
        "storageKey": null,
        "args": null,
        "concreteType": "Act",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
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
    "name": "ActNewActCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ActNewActCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ActNewActCreateMutation",
    "id": null,
    "text": "mutation ActNewActCreateMutation(\n  $input: ActCreateInput!\n) {\n  actCreate(input: $input) {\n    act {\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'a410c01ea69cf953c601b940ff3a9426';
export default node;
