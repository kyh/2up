import { gql, useQuery } from "@apollo/client";
import { useAuth } from "utils/AuthProvider";
import { collectConnectionNodes } from "utils/collectionUtil";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackSection } from "./components/Packs";
import { Pack } from "./PackDiscoverPage";
import { PackDiscoverPagePacksQuery } from "./__generated__/PackDiscoverPagePacksQuery";

export const PackCategoryPage = () => {
  const auth = useAuth();
  const { data } = useQuery<PackDiscoverPagePacksQuery>(PACKS_QUERY, {
    variables: { username: auth.user?.username || "" },
  });

  const featured = collectConnectionNodes(data?.featured);

  return (
    <Page>
      <Navigation />
      <Content>
        <PackSection>
          <div className="pack-section">
            <header className="pack-section-header main-header">
              <h1>Featured Games</h1>
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
  query PackCategoryPagePacksQuery {
    featured: packs(first: 10) {
      edges {
        node {
          id
          name
          description
          imageUrl
        }
      }
    }
  }
`;
