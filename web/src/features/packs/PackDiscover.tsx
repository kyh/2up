import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useAuth } from "util/AuthProvider";
import { collectConnectionNodes } from "util/collection";
import { Link, Carousel, ButtonLinkNative } from "components";
import { Content, Footer } from "./components/Page";
import { PackSection, Pack, PacksProps } from "./components/Packs";
import { PackDiscoverPagePacksQuery } from "./__generated__/PackDiscoverPagePacksQuery";

const refToTags: Record<
  string,
  {
    section1: { title: string; tags: string[] };
    section2: { title: string; tags: string[] };
    section3: { title: string; tags: string[] };
    section4: { title: string; tags: string[] };
  }
> = {
  producthunt: {
    section1: { title: "Packs for you", tags: ["product"] },
    section2: { title: "Featured Packs", tags: ["code"] },
    section3: { title: "Learn your geography", tags: ["geography"] },
    section4: { title: "Trending now", tags: ["crypto"] },
  },
  devto: {
    section1: { title: "Packs for you", tags: ["code"] },
    section2: { title: "Top played", tags: ["crypto"] },
    section3: { title: "Learn your geography", tags: ["geography"] },
    section4: { title: "Trending now", tags: ["product"] },
  },
  default: {
    section1: { title: "Featured Packs", tags: ["featured"] },
    section2: { title: "For the hackers", tags: ["code"] },
    section3: { title: "Trending now", tags: ["product", "crypto"] },
    section4: { title: "Learn your geography", tags: ["geography"] },
  },
};

export const PackDiscover = () => {
  const router = useRouter();
  const ref = (router.query.ref as string) || "default";
  const auth = useAuth();
  const { section1, section2, section3, section4 } = refToTags[ref];
  const { data } = useQuery<PackDiscoverPagePacksQuery>(PACKS_QUERY, {
    variables: {
      username: auth.user?.username || "",
      section1: section1.tags,
      section2: section2.tags,
      section3: section3.tags,
      section4: section4.tags,
    },
  });

  const section1Map = collectConnectionNodes(data?.section1);
  const section1Values = Object.values(section1Map);

  const section2Map = collectConnectionNodes(data?.section2);
  const section2Values = Object.values(section2Map);

  const section3Map = collectConnectionNodes(data?.section3);
  const section3Values = Object.values(section3Map);

  const section4Map = collectConnectionNodes(data?.section4);
  const section4Values = Object.values(section4Map);

  const myPacksMap = collectConnectionNodes(data?.my);
  const myPacks = Object.values(myPacksMap);

  return (
    <>
      <Content>
        <PackSection>
          <div className="pack-section spaced">
            <header className="pack-section-header main-header">
              <h1>{section1.title}</h1>
            </header>
            <div className="pack-items staggered-pack-items">
              {section1Values.map((pack) => (
                <Pack key={pack.id} pack={pack} showPlayButton />
              ))}
            </div>
          </div>
          <PackCarouselContainer
            title={section2.title}
            url={`/packs/category/${section2.tags[0]}`}
            packs={section2Values}
          />
          <PackCarouselContainer
            title={section3.title}
            url={`/packs/category/${section3.tags[0]}`}
            packs={section3Values}
          />
          <PackCarouselContainer
            title={section4.title}
            url={`/packs/category/${section4.tags[0]}`}
            packs={section4Values}
          />
          <PackCarouselContainer
            title="My Packs"
            url={`/u/${auth.user?.username}`}
            packs={myPacks}
            showNewPackButton
          />
        </PackSection>
      </Content>
      <Footer>
        {!auth.user && (
          <Link to="/auth/request">Want to build your own pack?</Link>
        )}
      </Footer>
    </>
  );
};

const PACKS_QUERY = gql`
  fragment DiscoverPagePackFragment on Pack {
    id
    name
    description
    imageUrl
  }

  query PackDiscoverPagePacksQuery(
    $username: String
    $section1: [String]
    $section2: [String]
    $section3: [String]
    $section4: [String]
  ) {
    section1: packs(tags: $section1, first: 5) {
      edges {
        node {
          ...DiscoverPagePackFragment
        }
      }
    }
    section2: packs(tags: $section2, first: 5) {
      edges {
        node {
          ...DiscoverPagePackFragment
        }
      }
    }
    section3: packs(tags: $section3, first: 5) {
      edges {
        node {
          ...DiscoverPagePackFragment
        }
      }
    }
    section4: packs(tags: $section4, first: 5) {
      edges {
        node {
          ...DiscoverPagePackFragment
        }
      }
    }
    my: packs(first: 10, username: $username) {
      edges {
        node {
          ...DiscoverPagePackFragment
        }
      }
    }
  }
`;

type PackCarouselContainerProp = {
  title: string;
  url: string;
  packs: PacksProps["pack"][];
  showNewPackButton?: boolean;
};

const PackCarouselContainer = ({
  packs,
  title,
  url,
  showNewPackButton = false,
}: PackCarouselContainerProp) => {
  if (!packs.length) return null;
  return (
    <div className="pack-section">
      <header className="pack-section-header">
        <h2>
          <Link className="category-link" to={url}>
            {title}
          </Link>
        </h2>
        {showNewPackButton && (
          <ButtonLinkNative to="/packs/new">Create new Pack</ButtonLinkNative>
        )}
      </header>
      <div className="pack-items">
        <Carousel>
          {packs.map((pack) => (
            <Pack key={pack.id} pack={pack} className="carousel-item" />
          ))}
        </Carousel>
      </div>
    </div>
  );
};
