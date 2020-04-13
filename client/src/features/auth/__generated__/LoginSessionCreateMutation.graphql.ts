/* tslint:disable */
/* eslint-disable */
/* @relayHash 0b9b2424538506672376d5b638238caa */

import { ConcreteRequest } from "relay-runtime";
export type SessionCreateInput = {
    password: string;
    username: string;
};
export type LoginSessionCreateMutationVariables = {
    input: SessionCreateInput;
};
export type LoginSessionCreateMutationResponse = {
    readonly sessionCreate: {
        readonly user: {
            readonly username: string;
            readonly email: string;
        };
        readonly token: string;
    } | null;
};
export type LoginSessionCreateMutation = {
    readonly response: LoginSessionCreateMutationResponse;
    readonly variables: LoginSessionCreateMutationVariables;
};



/*
mutation LoginSessionCreateMutation(
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
    "name": "LoginSessionCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "LoginSessionCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "LoginSessionCreateMutation",
    "id": null,
    "text": "mutation LoginSessionCreateMutation(\n  $input: SessionCreateInput!\n) {\n  sessionCreate(input: $input) {\n    user {\n      username\n      email\n    }\n    token\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '1b8db449ac1091e4b39b028834b13262';
export default node;
