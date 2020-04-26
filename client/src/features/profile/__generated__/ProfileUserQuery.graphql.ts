/* tslint:disable */
/* eslint-disable */
/* @relayHash 1833dbf7b34eb61ba47e538aa09c364d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ProfileUserQueryVariables = {
    username: string;
};
export type ProfileUserQueryResponse = {
    readonly currentUser: {
        readonly username: string;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Profile_packs">;
};
export type ProfileUserQuery = {
    readonly response: ProfileUserQueryResponse;
    readonly variables: ProfileUserQueryVariables;
};



/*
query ProfileUserQuery(
  $username: String!
) {
  currentUser {
    username
    id
  }
  ...Profile_packs_42ijek
}

fragment Profile_packs_42ijek on RootQueryType {
  packs(first: 100, username: $username) {
    edges {
      node {
        id
        name
        imageUrl
        description
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
    "name": "username",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "username",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "Variable",
  "name": "username",
  "variableName": "username"
},
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
  },
  (v2/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ProfileUserQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "currentUser",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ]
      },
      {
        "kind": "FragmentSpread",
        "name": "Profile_packs",
        "args": [
          (v2/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ProfileUserQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "currentUser",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v3/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "packs",
        "storageKey": null,
        "args": (v4/*: any*/),
        "concreteType": "PackConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "PackEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
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
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "imageUrl",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "description",
                    "args": null,
                    "storageKey": null
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
        "name": "packs",
        "args": (v4/*: any*/),
        "handle": "connection",
        "key": "Profile_packs",
        "filters": []
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ProfileUserQuery",
    "id": null,
    "text": "query ProfileUserQuery(\n  $username: String!\n) {\n  currentUser {\n    username\n    id\n  }\n  ...Profile_packs_42ijek\n}\n\nfragment Profile_packs_42ijek on RootQueryType {\n  packs(first: 100, username: $username) {\n    edges {\n      node {\n        id\n        name\n        imageUrl\n        description\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '832f2fe5543c7f4394a04fa70cc552a0';
export default node;
