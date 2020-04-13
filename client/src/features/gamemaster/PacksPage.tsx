import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Input } from "components";
import { HeaderContainer } from "./components/Page";

export const PacksPage = () => {
  return (
    <Page>
      <Header>
        <div className="left">
          <Link to="/gamemaster">
            <img className="logo" src="/logo/logomark.svg" alt="Playhouse" />
          </Link>
        </div>
      </Header>
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
            <Link to="/gamemaster/123" className="pack-item">
              <img
                src="https://ds055uzetaobb.cloudfront.net/brioche/chapter/Logic_1_by_1_white-wRqCbD.png?width=320"
                alt=""
              />
              <h4>Logic</h4>
              <p>
                Stretch your analytic muscles with knights, knaves, logic gates,
                and more!
              </p>
            </Link>
            <Link to="/gamemaster/123" className="pack-item">
              <img
                src="https://ds055uzetaobb.cloudfront.net/brioche/chapter/JoPS_1_by_1__-_light-wujOmY.png?width=320"
                alt=""
              />
              <h4>Joy of Problem Solving</h4>
              <p>
                A guided tour through our most beautiful and delightful puzzles.
              </p>
            </Link>
            <Link to="/gamemaster/123" className="pack-item">
              <img
                src="https://ds055uzetaobb.cloudfront.net/brioche/chapter/Logic_II_1_by_1_-_Dark_mode_white-FmrLoX.png?width=320"
                alt=""
              />
              <h4>Logic II</h4>
              <p>
                Exercise your rationality and learn the mathematical dialects of
                logic!
              </p>
            </Link>
          </div>
        </PackSection>
      </Content>
    </Page>
  );
};

const Header = styled(HeaderContainer)`
  .left {
    border-right: none;
  }
`;

const Page = styled.section`
  display: grid;
  height: calc((var(--vh, 1vh) * 100));
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
    display: flex;
  }

  .pack-item {
    max-width: 300px;
    margin-right: ${({ theme }) => theme.spacings(10)};
    padding: ${({ theme }) => theme.spacings(5)};
    border: 2px solid transparent;
    border-radius: ${({ theme }) => theme.border.wavyRadius};

    &:hover {
      border-color: ${({ theme }) => theme.border.alternateColor};
    }

    img {
      width: 160px;
      height: 160px;
      object-fit: cover;
      margin-bottom: ${({ theme }) => theme.spacings(2)};
    }
    h4 {
      margin-bottom: ${({ theme }) => theme.spacings(3)};
    }
    p {
      color: ${({ theme }) => theme.ui.lightText};
    }
  }
`;
