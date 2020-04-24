/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PackCreatorPage_view = {
    readonly pack: {
        readonly " $fragmentRefs": FragmentRefs<"Navigation_pack" | "Sidebar_pack">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ActPreview_act">;
    readonly " $refType": "PackCreatorPage_view";
};
export type PackCreatorPage_view$data = PackCreatorPage_view;
export type PackCreatorPage_view$key = {
    readonly " $data"?: PackCreatorPage_view$data;
    readonly " $fragmentRefs": FragmentRefs<"PackCreatorPage_view">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PackCreatorPage_view",
  "type": "RootQueryType",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "packId",
      "type": "ID!",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "actId",
      "type": "ID!",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "pack",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "packId"
        }
      ],
      "concreteType": "Pack",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "Navigation_pack",
          "args": null
        },
        {
          "kind": "FragmentSpread",
          "name": "Sidebar_pack",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ActPreview_act",
      "args": [
        {
          "kind": "Variable",
          "name": "actId",
          "variableName": "actId"
        }
      ]
    }
  ]
};
(node as any).hash = 'f2298de0a7bc30577e34a48faf289d8a';
export default node;
