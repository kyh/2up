/* tslint:disable */
/* eslint-disable */
/* @relayHash a9b2b8076bb0e29674621f41b2368e1c */

import { ConcreteRequest } from "relay-runtime";
export type UserCreateInput = {
    email: string;
    password: string;
    username: string;
};
export type UserNewUserCreateMutationVariables = {
    input: UserCreateInput;
};
export type UserNewUserCreateMutationResponse = {
    readonly userCreate: {
        readonly user: {
            readonly username: string;
            readonly email: string;
        };
        readonly token: string;
    } | null;
};
export type UserNewUserCreateMutation = {
    readonly response: UserNewUserCreateMutationResponse;
    readonly variables: UserNewUserCreateMutationVariables;
};



/*
mutation UserNewUserCreateMutation(
  $input: UserCreateInput!
) {
  userCreate(input: $input) {
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
    "type": "UserCreateInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "userCreate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UserCreatePayload",
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
    "name": "UserNewUserCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "UserNewUserCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "UserNewUserCreateMutation",
    "id": null,
    "text": "mutation UserNewUserCreateMutation(\n  $input: UserCreateInput!\n) {\n  userCreate(input: $input) {\n    user {\n      username\n      email\n    }\n    token\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '3dd6567b7aba05064bfa6d491b26616b';
export default node;
