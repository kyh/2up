import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "util/AuthProvider";
import { collectConnectionNodes } from "util/collection";
import { Carousel, CarouselItem, ButtonLinkNative } from "components";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackSection, Pack } from "./components/Packs";
import { PackDiscoverPagePacksQuery } from "./__generated__/PackDiscoverPagePacksQuery";

export const PackDiscoverPage = () => {
  const auth = useAuth();
  const { data } = useQuery<PackDiscoverPagePacksQuery>(PACKS_QUERY, {
    variables: { username: auth.user?.username || "" },
  });

  const featuredMap = collectConnectionNodes(data?.featured);
  const featured = Object.values(featuredMap);
  const myPacksMap = collectConnectionNodes(data?.my);
  const myPacks = Object.values(myPacksMap);

  return (
    <Page bgImage="/illustrations/space.svg" bgTop="100px">
      <Navigation />
      <Content>
        <PackSection>
          <div className="pack-section">
            <header className="pack-section-header main-header">
              <h1>Featured Games</h1>
            </header>
            <div className="pack-items staggered-pack-items">
              {featured.map((pack) => (
                <Pack key={pack.id} pack={pack} showPlayButton />
              ))}
            </div>
          </div>
          {!!myPacks.length && (
            <div className="pack-section">
              <header className="pack-section-header">
                <h2>
                  <Link
                    className="category-link"
                    to={`/@${auth.user?.username}`}
                  >
                    My Packs
                  </Link>
                </h2>
                <ButtonLinkNative to="/packs/new">
                  Create new Pack
                </ButtonLinkNative>
              </header>
              <div className="pack-items">
                <Carousel>
                  {myPacks.map((pack) => (
                    <CarouselItem key={pack.id}>
                      <Pack pack={pack} className="carousel-item" />
                    </CarouselItem>
                  ))}
                </Carousel>
              </div>
            </div>
          )}
        </PackSection>
      </Content>
    </Page>
  );
};

const PACKS_QUERY = gql`
  query PackDiscoverPagePacksQuery($username: String) {
    featured: packs(tags: ["featured"], first: 5) {
      edges {
        node {
          id
          name
          description
          imageUrl
        }
      }
    }
    my: packs(first: 10, username: $username) {
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
