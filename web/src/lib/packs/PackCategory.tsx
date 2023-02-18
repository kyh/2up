import { useRouter } from "next/router";
import { gql, useQuery } from "~/utils/mock";
import { Link } from "~/components";
import { Content } from "~/lib/packs/components/Page";
import { PackSection, PackItemsContainer, PackSectionHeader, Pack } from "~/lib/packs/components/Packs";

export const PackCategory = () => {
  const router = useRouter();
  const { tagSlug } = router.query;
  const { data } = useQuery(PACKS_QUERY, {
    variables: { tags: [tagSlug] },
  });

  const featuredMap = data?.packs;
  const featured = Object.values(featuredMap);

  return (
    <Content>
      <Link href="/packs" className="back-link">
        &#171; Back to packs
      </Link>
      <section>
        <PackSection>
          <PackSectionHeader className="mb-8">
            <h1 className="m-0 text-4xl font-bold">{tagSlug} Packs</h1>
          </PackSectionHeader>
          <PackItemsContainer>
            {featured.map((pack: any) => (
              <Pack key={pack.id} pack={pack} />
            ))}
          </PackItemsContainer>
        </PackSection>
      </section>
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
