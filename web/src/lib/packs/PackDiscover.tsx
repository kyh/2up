import { useRouter } from "next/router";
import { trpc } from "~/utils/trpc";
import { Link, Carousel, ButtonLinkNative } from "~/components";
import { Content, Footer } from "./components/Page";
import { PackSection, Pack, PacksProps } from "./components/Packs";

export const PackDiscover = () => {
  const router = useRouter();
  const ref = (router.query.ref as string) || "default";
  const res = trpc.proxy.pack.getDiscover.useQuery({ ref });

  if (!res.data) return null;

  const [featured, ...packSections] = res.data;

  return (
    <>
      <Content>
        <PackSection>
          <div className="pack-section spaced">
            <header className="pack-section-header main-header">
              <h1>{featured.title}</h1>
            </header>
            <div className="pack-items staggered-pack-items">
              {featured.packs.map((pack) => (
                <Pack key={pack.id} pack={pack} showPlayButton />
              ))}
            </div>
          </div>
          {packSections.map((section) => (
            <PackCarouselContainer
              key={section.title}
              title={section.title}
              url={`/packs/category/${section.tags[0]}`}
              packs={section.packs}
            />
          ))}
          {/* <PackCarouselContainer
            title="My Packs"
            url={`/u/${auth.user?.username}`}
            packs={myPacks}
            showNewPackButton
          /> */}
        </PackSection>
      </Content>
      <Footer>
        {/* {!auth.user && (
          <Link href="/auth/request">Want to build your own pack?</Link>
        )} */}
        <Link href="/auth/request">Want to build your own pack?</Link>
      </Footer>
    </>
  );
};

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
          <Link className="category-link" href={url}>
            {title}
          </Link>
        </h2>
        {showNewPackButton && (
          <ButtonLinkNative href="/packs/new">Create new Pack</ButtonLinkNative>
        )}
      </header>
      <Carousel>
        {packs.map((pack) => (
          <Pack key={pack.id} pack={pack} className="carousel-item" />
        ))}
      </Carousel>
    </div>
  );
};
