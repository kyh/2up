/* tslint:disable */
/* eslint-disable */
/* @relayHash 27dd14abf758d4b68f92acdfae1faf63 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PackCreatorPagePackQueryVariables = {
    packId: string;
    actId: string;
};
export type PackCreatorPagePackQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"PackCreatorPage_view">;
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
  ...PackCreatorPage_view_1NRrWQ
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

fragment Navigation_pack on Pack {
  id
  name
}

fragment PackCreatorPage_view_1NRrWQ on RootQueryType {
  pack(id: $packId) {
    ...Navigation_pack
    ...Sidebar_pack
    id
  }
  ...ActPreview_act_Bzqxt
}

fragment Sidebar_pack on Pack {
  id
  acts(first: 100) {
    edges {
      node {
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
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "question",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "answer",
  "args": null,
  "storageKey": null
},
v5 = [
  (v1/*: any*/),
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "slug",
    "args": null,
    "storageKey": null
  }
],
v6 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "questionType",
  "storageKey": null,
  "args": null,
  "concreteType": "QuestionType",
  "plural": false,
  "selections": (v5/*: any*/)
},
v7 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "answerType",
  "storageKey": null,
  "args": null,
  "concreteType": "AnswerType",
  "plural": false,
  "selections": (v5/*: any*/)
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
        "kind": "FragmentSpread",
        "name": "PackCreatorPage_view",
        "args": [
          {
            "kind": "Variable",
            "name": "actId",
            "variableName": "actId"
          },
          {
            "kind": "Variable",
            "name": "packId",
            "variableName": "packId"
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
          (v1/*: any*/),
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
            "args": (v2/*: any*/),
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
                      (v1/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
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
            "args": (v2/*: any*/),
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
          (v1/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PackCreatorPagePackQuery",
    "id": null,
    "text": "query PackCreatorPagePackQuery(\n  $packId: ID!\n  $actId: ID!\n) {\n  ...PackCreatorPage_view_1NRrWQ\n}\n\nfragment ActPreview_act_Bzqxt on RootQueryType {\n  act(id: $actId) {\n    id\n    question\n    answer\n    questionType {\n      id\n      slug\n    }\n    answerType {\n      id\n      slug\n    }\n  }\n}\n\nfragment Navigation_pack on Pack {\n  id\n  name\n}\n\nfragment PackCreatorPage_view_1NRrWQ on RootQueryType {\n  pack(id: $packId) {\n    ...Navigation_pack\n    ...Sidebar_pack\n    id\n  }\n  ...ActPreview_act_Bzqxt\n}\n\nfragment Sidebar_pack on Pack {\n  id\n  acts(first: 100) {\n    edges {\n      node {\n        id\n        question\n        answer\n        questionType {\n          id\n          slug\n        }\n        answerType {\n          id\n          slug\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '0bf8636951fcf5e3486205d7e22f8b88';
export default node;
