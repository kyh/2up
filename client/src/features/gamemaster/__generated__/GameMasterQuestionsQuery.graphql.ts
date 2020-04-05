/* tslint:disable */
/* eslint-disable */
/* @relayHash 64257ce5cd8fa776928cd6c130cbe73f */

import { ConcreteRequest } from "relay-runtime";
export type GameMasterQuestionsQueryVariables = {};
export type GameMasterQuestionsQueryResponse = {
    readonly questions: ReadonlyArray<{
        readonly id: string;
        readonly content: string;
    } | null> | null;
};
export type GameMasterQuestionsQuery = {
    readonly response: GameMasterQuestionsQueryResponse;
    readonly variables: GameMasterQuestionsQueryVariables;
};



/*
query GameMasterQuestionsQuery {
  questions {
    id
    content
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "questions",
    "storageKey": null,
    "args": null,
    "concreteType": "Question",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "id",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "content",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "GameMasterQuestionsQuery",
    "type": "RootQueryType",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "GameMasterQuestionsQuery",
    "argumentDefinitions": [],
    "selections": (v0/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "GameMasterQuestionsQuery",
    "id": null,
    "text": "query GameMasterQuestionsQuery {\n  questions {\n    id\n    content\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '38156f93f216b026429379842ee78e89';
export default node;
