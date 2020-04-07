/* tslint:disable */
/* eslint-disable */
/* @relayHash e9acc2e00899cf44712dac279a2e0f86 */

import { ConcreteRequest } from "relay-runtime";
export type UserNewUserCreateMutationVariables = {
    email: string;
    password: string;
    username: string;
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
  $email: String!
  $password: String!
  $username: String!
) {
  userCreate(username: $username, email: $email, password: $password) {
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
    "name": "email",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "password",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "username",
    "type": "String!",
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
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "password",
        "variableName": "password"
      },
      {
        "kind": "Variable",
        "name": "username",
        "variableName": "username"
      }
    ],
    "concreteType": "Session",
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
    "text": "mutation UserNewUserCreateMutation(\n  $email: String!\n  $password: String!\n  $username: String!\n) {\n  userCreate(username: $username, email: $email, password: $password) {\n    user {\n      username\n      email\n    }\n    token\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'c71915eb56bd9dcd47c66eaed5e35a4a';
export default node;
