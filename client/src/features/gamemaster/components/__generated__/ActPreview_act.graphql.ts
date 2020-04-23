/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ActPreview_act = {
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
  "type": "Act",
  "metadata": null,
  "argumentDefinitions": [],
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
};
})();
(node as any).hash = '58885010b17316a64f9436a8a9e0df27';
export default node;
