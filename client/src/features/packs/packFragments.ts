import { gql } from "@apollo/client";

export const PACK_FRAGMENT = gql`
  fragment PackFragment on Pack {
    id
    name
    description
    length
    isRandom
  }
`;

export const SCENE_FRAGMENT = gql`
  fragment SceneFragment on Scene {
    id
    externalId
    order
    instruction
    question
    questionType {
      id
      slug
    }
    sceneAnswers {
      id
      content
      isCorrect
    }
    answerType {
      id
      slug
    }
  }
`;

export const SCENES_FRAGMENT = gql`
  fragment ScenesFragment on Pack {
    id
    scenes(first: 500) {
      edges {
        node {
          ...SceneFragment
        }
      }
    }
  }
  ${SCENE_FRAGMENT}
`;
