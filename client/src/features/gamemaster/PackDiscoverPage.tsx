import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";
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
          <Link
            key={pack.id}
            to={`/gamemaster/${pack.id}`}
            className="pack-item"
          >
            {pack.imageUrl ? (
              <img src={pack.imageUrl || ""} alt={pack.name} />
            ) : (
              <DefaultImage />
            )}
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

const PackSection = styled.section`
  .pack-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 3fr));
    grid-gap: ${({ theme }) => theme.spacings(5)};
  }

  .pack-item {
    padding: ${({ theme }) => theme.spacings(5)};
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.border.wavyRadius};

    &:hover {
      border-color: ${({ theme }) => theme.border.alternateColor};
    }

    img {
      display: block;
      width: 100%;
      height: 160px;
      object-fit: cover;
      margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
    }

    h4 {
      margin-bottom: ${({ theme }) => theme.spacings(3)};
    }

    p {
      color: ${({ theme }) => theme.ui.lightText};
    }
  }
`;

export const DefaultImage = styled.div`
  width: 100%;
  height: 160px;
  background-color: #bcc7ff;
  margin: ${({ theme }) => `0 auto ${theme.spacings(2)}`};
`;
