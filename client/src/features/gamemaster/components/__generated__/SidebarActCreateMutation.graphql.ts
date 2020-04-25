/* tslint:disable */
/* eslint-disable */
/* @relayHash c7088f5c7aa1e342133294e3c4224a52 */

import { ConcreteRequest } from "relay-runtime";
export type ActCreateInput = {
    answer?: string | null;
    answerTypeId?: string | null;
    instruction?: string | null;
    order?: number | null;
    packId?: string | null;
    question?: string | null;
    questionTypeId?: string | null;
};
export type SidebarActCreateMutationVariables = {
    input: ActCreateInput;
};
export type SidebarActCreateMutationResponse = {
    readonly actCreate: {
        readonly act: {
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
        };
    } | null;
};
export type SidebarActCreateMutation = {
    readonly response: SidebarActCreateMutationResponse;
    readonly variables: SidebarActCreateMutationVariables;
};



/*
mutation SidebarActCreateMutation(
  $input: ActCreateInput!
) {
  actCreate(input: $input) {
    act {
      id
      question
      answer
      instruction
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
    "type": "ActCreateInput!",
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
    "name": "actCreate",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "ActCreatePayload",
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
    "name": "SidebarActCreateMutation",
    "type": "RootMutationType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SidebarActCreateMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v3/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "SidebarActCreateMutation",
    "id": null,
    "text": "mutation SidebarActCreateMutation(\n  $input: ActCreateInput!\n) {\n  actCreate(input: $input) {\n    act {\n      id\n      question\n      answer\n      instruction\n      questionType {\n        id\n        slug\n      }\n      answerType {\n        id\n        slug\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'fb1831cffe3508aef8050e9ba76e8e1d';
export default node;
