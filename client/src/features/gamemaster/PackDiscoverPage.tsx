import React, { Suspense } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay/hooks";

import { PackDiscoverPageQuery } from "./__generated__/PackDiscoverPageQuery.graphql";

import { Input } from "components";
import { Navigation } from "./components/Navigation";
import { Page, Content } from "./components/Page";

const PacksQuery = graphql`
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
  const data = useLazyLoadQuery<PackDiscoverPageQuery>(PacksQuery, {});

  return (
    <>
      {data?.packs?.edges?.map((edge) => {
        const pack = edge?.node;
        if (!pack) return null;
        return (
          <Link
            key={pack.id}
            to={`/gamemaster/${pack.id}?packName=${pack.name}`}
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
        <SearchBox>
          <h3>Browse all 30+ packs</h3>
          <div className="search">
            <Input placeholder="Search..." />
          </div>
        </SearchBox>
        <PackSection>
          <h3>Featured</h3>
          <div className="pack-items">
            <Suspense fallback="Loading...">
              <PacksList />
            </Suspense>
          </div>
        </PackSection>
      </Content>
    </Page>
  );
};

const SearchBox = styled.section`
  display: flex;
  background: ${({ theme }) => theme.ui.background};
  padding: ${({ theme }) => theme.spacings(5)};
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-bottom: ${({ theme }) => theme.spacings(7)};
  border: 2px dotted ${({ theme }) => theme.colors.lightGrey};

  h3 {
    margin-right: ${({ theme }) => theme.spacings(7)};
  }

  .search {
    flex: auto;
  }

  input {
    width: 100%;
  }
`;

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
