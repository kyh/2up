/* tslint:disable */
/* eslint-disable */
/* @relayHash 831e63465228b8978ab1944746bc0269 */

import { ConcreteRequest } from "relay-runtime";
export type ActDeleteInput = {
    id?: string | null;
    packId?: string | null;
};
export type SidebarActDeleteMutationVariables = {
    input: ActDeleteInput;
};
export type SidebarActDeleteMutationResponse = {
    readonly actDelete: {
        readonly act: {
            readonly id: string;
        };
    } | null;
};
export type SidebarActDeleteMutation = {
    readonly response: SidebarActDeleteMutationResponse;
    readonly variables: SidebarActDeleteMutationVariables;
};



/*
mutation SidebarActDeleteMutation(
  $input: ActDeleteInput!
) {
  actDelete(input: $input) {
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
    "type": "ActDeleteInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "actDelete",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ActDeletePayload",
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
    "name": "SidebarActDeleteMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SidebarActDeleteMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SidebarActDeleteMutation",
    "id": null,
    "text": "mutation SidebarActDeleteMutation(\n  $input: ActDeleteInput!\n) {\n  actDelete(input: $input) {\n    act {\n      id\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '95f13d61c9e11589a46289a92d9834f3';
export default node;
