import { Link, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "utils/AuthProvider";
import { collectConnectionNodes } from "utils/collectionUtil";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackSection, Pack } from "./components/Packs";
import { PackCategoryPagePacksQuery } from "./__generated__/PackCategoryPagePacksQuery";

export const PackCategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const auth = useAuth();
  const { data } = useQuery<PackCategoryPagePacksQuery>(PACKS_QUERY, {
    variables: { username: auth.user?.username || "" },
  });

  const featured = collectConnectionNodes(data?.packs);

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
              <h1>{categoryId} Games</h1>
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
  query PackCategoryPagePacksQuery($username: String) {
    packs(first: 10, username: $username) {
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
