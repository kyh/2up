/* tslint:disable */
/* eslint-disable */
/* @relayHash 95823824458fcc8e37aeb27a565212d1 */

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
      id
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "username",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "email",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "token",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "LoginSessionCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sessionCreate",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          },
          (v4/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "LoginSessionCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sessionCreate",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "LoginSessionCreateMutation",
    "id": null,
    "text": "mutation LoginSessionCreateMutation(\n  $input: SessionCreateInput!\n) {\n  sessionCreate(input: $input) {\n    user {\n      username\n      email\n      id\n    }\n    token\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '1b8db449ac1091e4b39b028834b13262';
export default node;
