/* tslint:disable */
/* eslint-disable */
/* @relayHash 6d225ccb4db0f2ddae0d6d7f9840aa74 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SidebarActsQueryVariables = {
    actId: string;
};
export type SidebarActsQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"ActPreview_act">;
};
export type SidebarActsQuery = {
    readonly response: SidebarActsQueryResponse;
    readonly variables: SidebarActsQueryVariables;
};



/*
query SidebarActsQuery(
  $actId: ID!
) {
  ...ActPreview_act_Bzqxt
}

fragment ActPreview_act_Bzqxt on RootQueryType {
  act(id: $actId) {
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "actId",
    "type": "ID!",
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
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SidebarActsQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
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
  },
  "operation": {
    "kind": "Operation",
    "name": "SidebarActsQuery",
    "argumentDefinitions": (v0/*: any*/),
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
  },
  "params": {
    "operationKind": "query",
    "name": "SidebarActsQuery",
    "id": null,
    "text": "query SidebarActsQuery(\n  $actId: ID!\n) {\n  ...ActPreview_act_Bzqxt\n}\n\nfragment ActPreview_act_Bzqxt on RootQueryType {\n  act(id: $actId) {\n    id\n    question\n    answer\n    questionType {\n      id\n      slug\n    }\n    answerType {\n      id\n      slug\n    }\n  }\n}\n",
    "metadata": {
      "derivedFrom": "ActPreview_act",
      "isRefetchableQuery": true
    }
  }
};
})();
(node as any).hash = 'd7c5c23517dea479079a2f14c9139907';
export default node;
