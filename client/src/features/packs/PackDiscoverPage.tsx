import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { useAuth } from "utils/AuthProvider";
import { ButtonLinkNative } from "components";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackSection } from "./components/Packs";
import {
  PackDiscoverPagePacksQuery,
  PackDiscoverPagePacksQuery_my,
  PackDiscoverPagePacksQuery_featured,
} from "./__generated__/PackDiscoverPagePacksQuery";

type PacksProps = {
  packs?:
    | PackDiscoverPagePacksQuery_my
    | PackDiscoverPagePacksQuery_featured
    | null;
};

const Packs = ({ packs }: PacksProps) => {
  return (
    <>
      {packs?.edges?.map((edge) => {
        const pack = edge?.node;
        if (!pack) return null;
        return (
          <Link to={`/packs/${pack.id}`} key={pack.id} className="pack-item">
            <article>
              <h2>{pack.name}</h2>
              <p>{pack.description}</p>
            </article>
          </Link>
        );
      })}
    </>
  );
};

export const PackDiscoverPage = () => {
  const auth = useAuth();
  const { data } = useQuery<PackDiscoverPagePacksQuery>(PACKS_QUERY, {
    variables: { username: auth.user?.username || "" },
  });

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
              <Packs packs={data?.featured} />
            </div>
          </div>
          {!!data?.my?.edges?.length && (
            <div className="pack-section">
              <header className="pack-section-header">
                <h2>My Packs</h2>
                <ButtonLinkNative to="/packs/new">
                  Create new Pack
                </ButtonLinkNative>
              </header>
              <div className="pack-items">
                <Packs packs={data?.my} />
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
    featured: packs(first: 5) {
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

/**
const samplePacks = [
  { id: 0, name: "Pack Name", description: "Sample pack 1212" },
  { id: 1, name: "Pack Name", description: "Sample pack 1212" },
  { id: 2, name: "Pack Name", description: "Sample pack 1212" },
  { id: 3, name: "Pack Name", description: "Sample pack 1212" },
  { id: 4, name: "Pack Name", description: "Sample pack 1212" },
  { id: 5, name: "Pack Name", description: "Sample pack 1212" },
  { id: 6, name: "Pack Name", description: "Sample pack 1212" },
  { id: 7, name: "Pack Name", description: "Sample pack 1212" },
  { id: 8, name: "Pack Name", description: "Sample pack 1212" },
];

<Carousel>
  {samplePacks.map((pack) => (
    <CarouselItem>
      <Link
        to={`/packs/${pack.id}`}
        key={pack.id}
        className="pack-item full-width"
      >
        <article>
          <h2>{pack.name}</h2>
          <p>{pack.description}</p>
        </article>
      </Link>
    </CarouselItem>
  ))}
</Carousel>
 */
