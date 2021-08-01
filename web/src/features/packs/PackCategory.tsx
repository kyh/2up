import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { collectConnectionNodes } from "util/collection";
import { Link } from "components";
import { Content } from "features/packs/components/Page";
import { PackSection, Pack } from "features/packs/components/Packs";

import { PackCategoryPagePacksQuery } from "./__generated__/PackCategoryPagePacksQuery";

export const PackCategory = () => {
  const router = useRouter();
  const { tagSlug } = router.query;
  const { data } = useQuery<PackCategoryPagePacksQuery>(PACKS_QUERY, {
    variables: { tags: [tagSlug] },
  });

  const featuredMap = collectConnectionNodes(data?.packs);
  const featured = Object.values(featuredMap);

  return (
    <Content>
      <Link to="/packs" className="back-link">
        &#171; Back to packs
      </Link>
      <PackSection>
        <div className="pack-section">
          <header className="pack-section-header mb">
            <h1>{tagSlug} Packs</h1>
          </header>
          <div className="pack-items">
            {featured.map((pack) => (
              <Pack key={pack.id} pack={pack} />
            ))}
          </div>
        </div>
      </PackSection>
    </Content>
  );
};

const PACKS_QUERY = gql`
  query PackCategoryPagePacksQuery($tags: [String]) {
    packs(tags: $tags, first: 10) {
      edges {
        node {
          id
          name
          imageUrl
          description
        }
      }
    }
  }
`;
