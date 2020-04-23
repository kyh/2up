/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Navigation_pack = {
    readonly id: string;
    readonly name: string;
    readonly " $refType": "Navigation_pack";
};
export type Navigation_pack$data = Navigation_pack;
export type Navigation_pack$key = {
    readonly " $data"?: Navigation_pack$data;
    readonly " $fragmentRefs": FragmentRefs<"Navigation_pack">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Navigation_pack",
  "type": "Pack",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '5c6cdf18c9b0f746e6961fe206719435';
export default node;
