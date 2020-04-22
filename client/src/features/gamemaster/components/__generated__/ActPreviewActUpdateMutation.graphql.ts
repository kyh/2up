/* tslint:disable */
/* eslint-disable */
/* @relayHash 9a57076c5163d25185b3dd4c090a909a */

import { ConcreteRequest } from "relay-runtime";
export type ActUpdateInput = {
    answer?: string | null;
    answerTypeId?: string | null;
    id?: string | null;
    order?: number | null;
    question?: string | null;
    questionTypeId?: string | null;
};
export type ActPreviewActUpdateMutationVariables = {
    input: ActUpdateInput;
};
export type ActPreviewActUpdateMutationResponse = {
    readonly actUpdate: {
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
        };
    } | null;
};
export type ActPreviewActUpdateMutation = {
    readonly response: ActPreviewActUpdateMutationResponse;
    readonly variables: ActPreviewActUpdateMutationVariables;
};



/*
mutation ActPreviewActUpdateMutation(
  $input: ActUpdateInput!
) {
  actUpdate(input: $input) {
    act {
      id
      question
      answer
      questionType {
        id
        slug
      }
      answerType {
        id
        slug
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "ActUpdateInput!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  (v1/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "slug",
    "args": null,
    "storageKey": null
  }
],
v3 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "actUpdate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ActUpdatePayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "act",
        "storageKey": null,
        "args": null,
        "concreteType": "Act",
        "plural": false,
        "selections": [
          (v1/*: any*/),
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
            "selections": (v2/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "answerType",
            "storageKey": null,
            "args": null,
            "concreteType": "AnswerType",
            "plural": false,
            "selections": (v2/*: any*/)
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ActPreviewActUpdateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ActPreviewActUpdateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ActPreviewActUpdateMutation",
    "id": null,
    "text": "mutation ActPreviewActUpdateMutation(\n  $input: ActUpdateInput!\n) {\n  actUpdate(input: $input) {\n    act {\n      id\n      question\n      answer\n      questionType {\n        id\n        slug\n      }\n      answerType {\n        id\n        slug\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'e959f1d68c91455bd98c5b4e7c717a3e';
export default node;
