import { useRouter } from "next/router";
import { Link, Carousel, ButtonLinkNative, Spinner } from "@/components";
import { Content, Footer } from "./components/page";
import {
  PackSection,
  PackItemsContainer,
  PackCategoryLink,
  Pack,
  PackSectionHeader,
  PacksProps,
} from "./components/packs";
import { useGetDiscover } from "./use-pack-actions";

export const PackDiscover = () => {
  const router = useRouter();
  const ref = (router.query.ref as string) || "default";
  const res = useGetDiscover(ref);

  if (!res.data) return <Spinner />;

  const [featured, ...packSections] = res.data;

  return (
    <>
      <Content>
        <section>
          <PackSection variant="spaced">
            <PackSectionHeader variant="mainHeader">
              <h1 className="text-4xl font-bold">{featured.title}</h1>
            </PackSectionHeader>
            <PackItemsContainer variant="staggered">
              {featured.packs.map((pack) => (
                <Pack
                  variant="staggered"
                  key={pack.id}
                  pack={pack}
                  showPlayButton
                />
              ))}
            </PackItemsContainer>
          </PackSection>
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
        </section>
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
    <PackSection>
      <PackSectionHeader>
        <h2 className="m-0 text-2xl font-bold">
          <PackCategoryLink href={url}>{title}</PackCategoryLink>
        </h2>
        {showNewPackButton && (
          <ButtonLinkNative href="/packs/new">Create new Pack</ButtonLinkNative>
        )}
      </PackSectionHeader>
      <Carousel>
        {packs.map((pack) => (
          <Pack key={pack.id} pack={pack} className="carousel-item" />
        ))}
      </Carousel>
    </PackSection>
  );
};
