import React, { Suspense } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import graphql from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay/hooks";

import { Input } from "components";
import { Navigation } from "./components/Navigation";
import { PackDiscoverPageQuery } from "./__generated__/PackDiscoverPageQuery.graphql";

const PacksQuery = graphql`
  query PackDiscoverPageQuery {
    packs(first: 5) {
      edges {
        node {
          id
          name
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
            to={`/gamemaster/${pack.id}`}
            className="pack-item"
          >
            <img
              src="https://ds055uzetaobb.cloudfront.net/brioche/chapter/Logic_1_by_1_white-wRqCbD.png?width=320"
              alt={pack.name}
            />
            <h4>{pack.name}</h4>
            <p>
              A guided tour through our most beautiful and delightful puzzles.
            </p>
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

const Page = styled.section`
  display: grid;
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header  header  header"
    "content content content"
    "footer  footer  footer";
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 50px 1fr 50px;
`;

const Content = styled.section`
  max-width: 900px;
  margin: 0 auto;
  grid-area: content;
  padding: ${({ theme }) => `${theme.spacings(10)} ${theme.spacings(5)}`};
`;

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
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: ${({ theme }) => theme.spacings(5)};
  }

  .pack-item {
    max-width: 300px;
    padding: ${({ theme }) => theme.spacings(5)};
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.border.wavyRadius};

    &:hover {
      border-color: ${({ theme }) => theme.border.alternateColor};
    }

    img {
      display: block;
      width: 160px;
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
