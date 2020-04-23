/* tslint:disable */
/* eslint-disable */
/* @relayHash 4f41a41202a1d7bcbe8eed05f3f3eff3 */

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
    readonly act: {
        readonly " $fragmentRefs": FragmentRefs<"ActPreview_act">;
    } | null;
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
  act(id: $actId) {
    ...ActPreview_act
    id
  }
}

fragment ActPreview_act on Act {
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
        answer
        question
        questionType {
          slug
          id
        }
        answerType {
          slug
          id
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
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "actId"
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
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
  "name": "question",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v8 = [
  (v7/*: any*/),
  (v3/*: any*/)
],
v9 = [
  (v3/*: any*/),
  (v7/*: any*/)
];
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
        "kind": "LinkedField",
        "alias": null,
        "name": "act",
        "storageKey": null,
        "args": (v2/*: any*/),
        "concreteType": "Act",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ActPreview_act",
            "args": null
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
          (v3/*: any*/),
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
            "args": (v4/*: any*/),
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
                      (v3/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "questionType",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "QuestionType",
                        "plural": false,
                        "selections": (v8/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "answerType",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AnswerType",
                        "plural": false,
                        "selections": (v8/*: any*/)
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
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "acts",
            "args": (v4/*: any*/),
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
        "args": (v2/*: any*/),
        "concreteType": "Act",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          (v6/*: any*/),
          (v5/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "questionType",
            "storageKey": null,
            "args": null,
            "concreteType": "QuestionType",
            "plural": false,
            "selections": (v9/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "answerType",
            "storageKey": null,
            "args": null,
            "concreteType": "AnswerType",
            "plural": false,
            "selections": (v9/*: any*/)
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PackCreatorPagePackQuery",
    "id": null,
    "text": "query PackCreatorPagePackQuery(\n  $packId: ID!\n  $actId: ID!\n) {\n  pack(id: $packId) {\n    ...Navigation_pack\n    ...Sidebar_pack\n    id\n  }\n  act(id: $actId) {\n    ...ActPreview_act\n    id\n  }\n}\n\nfragment ActPreview_act on Act {\n  id\n  question\n  answer\n  questionType {\n    id\n    slug\n  }\n  answerType {\n    id\n    slug\n  }\n}\n\nfragment Navigation_pack on Pack {\n  id\n  name\n}\n\nfragment Sidebar_pack on Pack {\n  id\n  acts(first: 100) {\n    edges {\n      node {\n        id\n        answer\n        question\n        questionType {\n          slug\n          id\n        }\n        answerType {\n          slug\n          id\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'd410a0e04aef34c8dc8087d1eda22aa9';
export default node;
