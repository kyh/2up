import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { collectConnectionNodes } from "util/collection";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackSection, Pack } from "./components/Packs";
import { PackCategoryPagePacksQuery } from "./__generated__/PackCategoryPagePacksQuery";

export const PackCategoryPage = () => {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const { data } = useQuery<PackCategoryPagePacksQuery>(PACKS_QUERY, {
    variables: { tags: [tagSlug] },
  });

  const featuredMap = collectConnectionNodes(data?.packs);
  const featured = Object.values(featuredMap);

  return (
    <Page>
      <Navigation />
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
                <Pack pack={pack} />
              ))}
            </div>
          </div>
        </PackSection>
      </Content>
    </Page>
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
