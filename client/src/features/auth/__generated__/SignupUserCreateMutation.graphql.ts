/* tslint:disable */
/* eslint-disable */
/* @relayHash c0cd38e73a572230573a77f18e723298 */

import { ConcreteRequest } from "relay-runtime";
export type UserCreateInput = {
    email: string;
    password: string;
    username: string;
};
export type SignupUserCreateMutationVariables = {
    input: UserCreateInput;
};
export type SignupUserCreateMutationResponse = {
    readonly userCreate: {
        readonly user: {
            readonly username: string;
            readonly email: string;
        };
        readonly token: string;
    } | null;
};
export type SignupUserCreateMutation = {
    readonly response: SignupUserCreateMutationResponse;
    readonly variables: SignupUserCreateMutationVariables;
};



/*
mutation SignupUserCreateMutation(
  $input: UserCreateInput!
) {
  userCreate(input: $input) {
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
    "type": "UserCreateInput!",
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
    "name": "SignupUserCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "userCreate",
        "storageKey": null,
        "args": (v1/*: any*/),
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
    "name": "SignupUserCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "userCreate",
        "storageKey": null,
        "args": (v1/*: any*/),
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
    "name": "SignupUserCreateMutation",
    "id": null,
    "text": "mutation SignupUserCreateMutation(\n  $input: UserCreateInput!\n) {\n  userCreate(input: $input) {\n    user {\n      username\n      email\n      id\n    }\n    token\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '8180694a99a0f5a3d35b5a647401e2b9';
export default node;
