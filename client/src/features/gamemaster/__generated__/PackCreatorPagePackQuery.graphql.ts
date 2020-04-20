/* tslint:disable */
/* eslint-disable */
/* @relayHash 2a2fad5b91953a2339edfb3b184a4fa4 */

import { ConcreteRequest } from "relay-runtime";
export type PackCreatorPagePackQueryVariables = {
    id: string;
};
export type PackCreatorPagePackQueryResponse = {
    readonly pack: {
        readonly id: string;
        readonly name: string;
        readonly acts: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly answer: string | null;
                    readonly question: string;
                    readonly questionType: {
                        readonly slug: string;
                    };
                    readonly answerType: {
                        readonly slug: string;
                    };
                } | null;
            } | null> | null;
        } | null;
    } | null;
};
export type PackCreatorPagePackQuery = {
    readonly response: PackCreatorPagePackQueryResponse;
    readonly variables: PackCreatorPagePackQueryVariables;
};



/*
query PackCreatorPagePackQuery(
  $id: ID!
) {
  pack(id: $id) {
    id
    name
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
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
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
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "question",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v7 = [
  (v6/*: any*/)
],
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v10 = {
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
},
v11 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v12 = [
  (v6/*: any*/),
  (v2/*: any*/)
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
          (v2/*: any*/),
          (v3/*: any*/),
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
                      (v2/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "questionType",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "QuestionType",
                        "plural": false,
                        "selections": (v7/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "answerType",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AnswerType",
                        "plural": false,
                        "selections": (v7/*: any*/)
                      },
                      (v8/*: any*/)
                    ]
                  },
                  (v9/*: any*/)
                ]
              },
              (v10/*: any*/)
            ]
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
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "acts",
            "storageKey": "acts(first:100)",
            "args": (v11/*: any*/),
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
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "questionType",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "QuestionType",
                        "plural": false,
                        "selections": (v12/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "answerType",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AnswerType",
                        "plural": false,
                        "selections": (v12/*: any*/)
                      },
                      (v8/*: any*/)
                    ]
                  },
                  (v9/*: any*/)
                ]
              },
              (v10/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "acts",
            "args": (v11/*: any*/),
            "handle": "connection",
            "key": "PackCreatorPage_acts",
            "filters": []
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PackCreatorPagePackQuery",
    "id": null,
    "text": "query PackCreatorPagePackQuery(\n  $id: ID!\n) {\n  pack(id: $id) {\n    id\n    name\n    acts(first: 100) {\n      edges {\n        node {\n          id\n          answer\n          question\n          questionType {\n            slug\n            id\n          }\n          answerType {\n            slug\n            id\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n}\n",
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "pack",
            "acts"
          ]
        }
      ]
    }
  }
};
})();
(node as any).hash = '6398a8ddcf23e91a73201ee2dcbd97e0';
export default node;
