/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ActPreview_act = {
    readonly act: {
        readonly id: string;
        readonly question: string;
        readonly answer: string | null;
        readonly questionType: {
            readonly id: string;
            readonly slug: string;
        };
        readonly answerType: {
            readonly id: string;
            readonly slug: string;
        };
    } | null;
    readonly " $refType": "ActPreview_act";
};
export type ActPreview_act$data = ActPreview_act;
export type ActPreview_act$key = {
    readonly " $data"?: ActPreview_act$data;
    readonly " $fragmentRefs": FragmentRefs<"ActPreview_act">;
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
  "name": "ActPreview_act",
  "type": "RootQueryType",
  "metadata": {
    "refetch": {
      "connection": null,
      "operation": require('./SidebarActsQuery.graphql.ts'),
      "fragmentPathInResult": []
    }
  },
  "argumentDefinitions": [
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
      "name": "act",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "id",
          "variableName": "actId"
        }
      ],
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
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'd7c5c23517dea479079a2f14c9139907';
export default node;
