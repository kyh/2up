import React from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";

import { Input } from "components";

import { Navigation } from "./components/Navigation";

export const PackDetailsPage = () => {
  const { packId } = useParams();
  return (
    <Page>
      <Navigation />
      <Content>
        <Link to={`/gamemaster/${packId}/edit`}>Edit</Link>
      </Content>
    </Page>
  );
};

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
