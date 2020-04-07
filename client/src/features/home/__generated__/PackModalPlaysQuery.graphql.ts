/* tslint:disable */
/* eslint-disable */
/* @relayHash 856b79a31a7683133bc4fbcc854b2621 */

import { ConcreteRequest } from "relay-runtime";
export type PackModalPlaysQueryVariables = {};
export type PackModalPlaysQueryResponse = {
    readonly plays: ReadonlyArray<string | null> | null;
};
export type PackModalPlaysQuery = {
    readonly response: PackModalPlaysQueryResponse;
    readonly variables: PackModalPlaysQueryVariables;
};



/*
query PackModalPlaysQuery {
  plays
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "plays",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PackModalPlaysQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "PackModalPlaysQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "PackModalPlaysQuery",
    "id": null,
    "text": "query PackModalPlaysQuery {\n  plays\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '57e2025f8d0da5c737efd9e6290c7167';
export default node;
