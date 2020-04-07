/* tslint:disable */
/* eslint-disable */
/* @relayHash de0e618d171c64d4d585f8d77dc802f9 */

import { ConcreteRequest } from "relay-runtime";
export type PackModalPacksQueryVariables = {};
export type PackModalPacksQueryResponse = {
  readonly packs: ReadonlyArray<string | null> | null;
};
export type PackModalPacksQuery = {
  readonly response: PackModalPacksQueryResponse;
  readonly variables: PackModalPacksQueryVariables;
};

/*
query PackModalPacksQuery {
  packs
}
*/

const node: ConcreteRequest = (function () {
  var v0 = [
    {
      kind: "ScalarField",
      alias: null,
      name: "packs",
      args: null,
      storageKey: null,
    },
  ];
  return {
    kind: "Request",
    fragment: {
      kind: "Fragment",
      name: "PackModalPacksQuery",
      type: "RootQueryType",
      metadata: null,
      argumentDefinitions: [],
      selections: v0 /*: any*/,
    },
    operation: {
      kind: "Operation",
      name: "PackModalPacksQuery",
      argumentDefinitions: [],
      selections: v0 /*: any*/,
    },
    params: {
      operationKind: "query",
      name: "PackModalPacksQuery",
      id: null,
      text: "query PackModalPacksQuery {\n  packs\n}\n",
      metadata: {},
    },
  };
})();
(node as any).hash = "c1ef1278f801f02119653571eab5b57b";
export default node;
