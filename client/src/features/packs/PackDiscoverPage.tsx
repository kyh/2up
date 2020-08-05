import React from "react";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

import { ButtonLinkNative } from "components";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackSection, PackImage } from "./components/Packs";
import {
  PackDiscoverPageQuery,
  PackDiscoverPageQuery_my,
  PackDiscoverPageQuery_featured,
} from "./__generated__/PackDiscoverPageQuery";

const PACKS_QUERY = gql`
  query PackDiscoverPageQuery($username: String) {
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

const Packs: React.FC<{
  packs?: PackDiscoverPageQuery_my | PackDiscoverPageQuery_featured | null;
}> = ({ packs }) => {
  return (
    <>
      {packs?.edges?.map((edge) => {
        const pack = edge?.node;
        if (!pack) return null;
        return (
          <div key={pack.id} className="pack-item">
            <Link to={`/packs/${pack.id}`}>
              <PackImage src={pack.imageUrl} />
              <h4>{pack.name}</h4>
              <p>{pack.description}</p>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export const PackDiscoverPage = () => {
  const { data } = useQuery<PackDiscoverPageQuery>(PACKS_QUERY, {
    variables: { username: localStorage.getItem("username") || "" },
  });

  return (
    <Page bgImage="/illustrations/space.svg" bgTop="100px">
      <Navigation />
      <Content>
        <PackSection>
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
          <div className="pack-section">
            <header className="pack-section-header">
              <h2>Featured</h2>
            </header>
            <div className="pack-items">
              <Packs packs={data?.featured} />
            </div>
          </div>
        </PackSection>
      </Content>
    </Page>
  );
};
