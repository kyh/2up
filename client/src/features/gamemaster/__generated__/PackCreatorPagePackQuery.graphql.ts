/* tslint:disable */
/* eslint-disable */
/* @relayHash 39b3519816f3f0fc9560ed94f00b66b3 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PackCreatorPagePackQueryVariables = {
    packId: string;
    actId: string;
};
export type PackCreatorPagePackQueryResponse = {
    readonly pack: {
        readonly " $fragmentRefs": FragmentRefs<"Navigation_pack" | "Sidebar_pack">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ActPreview_act">;
};
export type PackCreatorPagePackQuery = {
    readonly response: PackCreatorPagePackQueryResponse;
    readonly variables: PackCreatorPagePackQueryVariables;
};



/*
query PackCreatorPagePackQuery(
  $packId: ID!
  $actId: ID!
) {
  pack(id: $packId) {
    ...Navigation_pack
    ...Sidebar_pack
    id
  }
  ...ActPreview_act_Bzqxt
}

fragment ActPreview_act_Bzqxt on RootQueryType {
  act(id: $actId) {
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

fragment Navigation_pack on Pack {
  id
  name
}

fragment Sidebar_pack on Pack {
  id
  acts(first: 100) {
    edges {
      node {
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
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "packId"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "question",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "answer",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "instruction",
  "args": null,
  "storageKey": null
},
v7 = [
  (v2/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "slug",
    "args": null,
    "storageKey": null
  }
],
v8 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "questionType",
  "storageKey": null,
  "args": null,
  "concreteType": "QuestionType",
  "plural": false,
  "selections": (v7/*: any*/)
},
v9 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "answerType",
  "storageKey": null,
  "args": null,
  "concreteType": "AnswerType",
  "plural": false,
  "selections": (v7/*: any*/)
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PackCreatorPagePackQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "pack",
        "storageKey": null,
        "args": (v1/*: any*/),
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
  },
  "operation": {
    "kind": "Operation",
    "name": "PackCreatorPagePackQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "pack",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Pack",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "acts",
            "storageKey": "acts(first:100)",
            "args": (v3/*: any*/),
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
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
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
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "acts",
            "args": (v3/*: any*/),
            "handle": "connection",
            "key": "PackCreatorPage_acts",
            "filters": []
          }
        ]
      },
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
          (v2/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PackCreatorPagePackQuery",
    "id": null,
    "text": "query PackCreatorPagePackQuery(\n  $packId: ID!\n  $actId: ID!\n) {\n  pack(id: $packId) {\n    ...Navigation_pack\n    ...Sidebar_pack\n    id\n  }\n  ...ActPreview_act_Bzqxt\n}\n\nfragment ActPreview_act_Bzqxt on RootQueryType {\n  act(id: $actId) {\n    id\n    question\n    answer\n    instruction\n    questionType {\n      id\n      slug\n    }\n    answerType {\n      id\n      slug\n    }\n  }\n}\n\nfragment Navigation_pack on Pack {\n  id\n  name\n}\n\nfragment Sidebar_pack on Pack {\n  id\n  acts(first: 100) {\n    edges {\n      node {\n        id\n        question\n        answer\n        instruction\n        questionType {\n          id\n          slug\n        }\n        answerType {\n          id\n          slug\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '9973027bd53d1e720c64749a1438d1b7';
export default node;
