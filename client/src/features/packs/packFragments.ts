import { gql } from "@apollo/client";

export const PACK_FRAGMENT = gql`
  fragment PackFragment on Pack {
    id
    name
    description
    length
    isRandom
    tags {
      id
      name
    }
  }
`;
