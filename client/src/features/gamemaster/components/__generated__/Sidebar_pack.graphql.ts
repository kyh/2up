/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sidebar_pack = {
    readonly id: string;
    readonly acts: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly question: string;
                readonly answer: string | null;
                readonly instruction: string | null;
                readonly questionType: {
                    readonly id: string;
                    readonly slug: string;
                };
                readonly answerType: {
                    readonly id: string;
                    readonly slug: string;
                };
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "Sidebar_pack";
};
export type Sidebar_pack$data = Sidebar_pack;
export type Sidebar_pack$key = {
    readonly " $data"?: Sidebar_pack$data;
    readonly " $fragmentRefs": FragmentRefs<"Sidebar_pack">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
  (v0/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "slug",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "Sidebar_pack",
  "type": "Pack",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "acts"
        ]
      }
    ]
  },
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": "acts",
      "name": "__PackCreatorPage_acts_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "ActConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ActEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Act",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "question",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "answer",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "instruction",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "questionType",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "QuestionType",
                  "plural": false,
                  "selections": (v1/*: any*/)
                },
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "answerType",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "AnswerType",
                  "plural": false,
                  "selections": (v1/*: any*/)
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "pageInfo",
          "storageKey": null,
          "args": null,
          "concreteType": "PageInfo",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "endCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasNextPage",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'f7e4584f018066b0fe40dd61ce7650de';
export default node;
