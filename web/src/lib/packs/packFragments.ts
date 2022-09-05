import { gql } from "~/utils/mock";

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
