/* tslint:disable */
/* eslint-disable */
/* @relayHash a02bb1cdc683faae71c05deaefa5dd35 */

import { ConcreteRequest } from "relay-runtime";
export type SessionCreateInput = {
    password: string;
    username: string;
};
export type SessionNewSessionCreateMutationVariables = {
    input: SessionCreateInput;
};
export type SessionNewSessionCreateMutationResponse = {
    readonly sessionCreate: {
        readonly user: {
            readonly username: string;
            readonly email: string;
        };
        readonly token: string;
    } | null;
};
export type SessionNewSessionCreateMutation = {
    readonly response: SessionNewSessionCreateMutationResponse;
    readonly variables: SessionNewSessionCreateMutationVariables;
};



/*
mutation SessionNewSessionCreateMutation(
  $input: SessionCreateInput!
) {
  sessionCreate(input: $input) {
    user {
      username
      email
    }
    token
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "SessionCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "sessionCreate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SessionCreatePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "user",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "username",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "email",
            "args": null,
            "storageKey": null
          }
        ]
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "token",
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
    "name": "SessionNewSessionCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SessionNewSessionCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SessionNewSessionCreateMutation",
    "id": null,
    "text": "mutation SessionNewSessionCreateMutation(\n  $input: SessionCreateInput!\n) {\n  sessionCreate(input: $input) {\n    user {\n      username\n      email\n    }\n    token\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '240f0d56e235fc1e3d6f9875bbf628f6';
export default node;
