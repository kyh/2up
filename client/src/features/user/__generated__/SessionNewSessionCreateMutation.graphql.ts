/* tslint:disable */
/* eslint-disable */
/* @relayHash b544ed98cd91e536d4de6fc008a75a52 */

import { ConcreteRequest } from "relay-runtime";
export type SessionNewSessionCreateMutationVariables = {
    username: string;
    password: string;
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
  $username: String!
  $password: String!
) {
  sessionCreate(username: $username, password: $password) {
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
    "name": "username",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "password",
    "type": "String!",
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
    "text": "mutation SessionNewSessionCreateMutation(\n  $username: String!\n  $password: String!\n) {\n  sessionCreate(username: $username, password: $password) {\n    user {\n      username\n      email\n    }\n    token\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '04098bebbc97f5ef5383d4726e613552';
export default node;
