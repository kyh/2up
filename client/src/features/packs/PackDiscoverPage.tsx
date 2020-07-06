import React from "react";
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
import { PackSection, PackImage } from "./components/Packs";
import { PackDiscoverPageQuery } from "./__generated__/PackDiscoverPageQuery";

const PACKS_QUERY = gql`
  query PackDiscoverPageQuery {
    packs(first: 5) {
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

const PacksList = () => {
  const { data } = useQuery<PackDiscoverPageQuery>(PACKS_QUERY);

  return (
    <>
      {data?.packs?.edges?.map((edge) => {
        const pack = edge?.node;
        if (!pack) return null;
        return (
          <Link key={pack.id} to={`/packs/${pack.id}`} className="pack-item">
            <PackImage src={pack.imageUrl} />
            <h4>{pack.name}</h4>
            <p>{pack.description}</p>
          </Link>
        );
      })}
    </>
  );
};

export const PackDiscoverPage = () => {
  return (
    <Page>
      <Navigation />
      <Content>
        <PackSection>
          <h3>Featured</h3>
          <div className="pack-items">
            <PacksList />
          </div>
        </PackSection>
      </Content>
    </Page>
  );
};
