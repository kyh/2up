/* tslint:disable */
/* eslint-disable */
/* @relayHash 41ac9e9ca1affc29b8dedd60aa68b6f7 */

import { ConcreteRequest } from "relay-runtime";
export type HomeGameCheckMutationVariables = {
  code: string;
};
export type HomeGameCheckMutationResponse = {
  readonly game: {
    readonly isValid: boolean;
  } | null;
};
export type HomeGameCheckMutation = {
  readonly response: HomeGameCheckMutationResponse;
  readonly variables: HomeGameCheckMutationVariables;
};

/*
mutation HomeGameCheckMutation(
  $code: String!
) {
  game(code: $code) {
    isValid
  }
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        kind: "LocalArgument",
        name: "code",
        type: "String!",
        defaultValue: null,
      },
    ],
    v1 = [
      {
        kind: "LinkedField",
        alias: null,
        name: "game",
        storageKey: null,
        args: [
          {
            kind: "Variable",
            name: "code",
            variableName: "code",
          },
        ],
        concreteType: "Game",
        plural: false,
        selections: [
          {
            kind: "ScalarField",
            alias: null,
            name: "isValid",
            args: null,
            storageKey: null,
          },
        ],
      },
    ];
  return {
    kind: "Request",
    fragment: {
      kind: "Fragment",
      name: "HomeGameCheckMutation",
      type: "RootMutationType",
      metadata: null,
      argumentDefinitions: v0 /*: any*/,
      selections: v1 /*: any*/,
    },
    operation: {
      kind: "Operation",
      name: "HomeGameCheckMutation",
      argumentDefinitions: v0 /*: any*/,
      selections: v1 /*: any*/,
    },
    params: {
      operationKind: "mutation",
      name: "HomeGameCheckMutation",
      id: null,
      text:
        "mutation HomeGameCheckMutation(\n  $code: String!\n) {\n  game(code: $code) {\n    isValid\n  }\n}\n",
      metadata: {},
    },
  };
})();
(node as any).hash = "4049a07f4552ce5e94046970e513262e";
export default node;
