import React from "react";
import styled from "styled-components";

export const Header = () => {
  return (
    <HeaderContainer>
      <img className="logo" src="/logo/logomark.svg" alt="Playhouse" />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.section`
  position: relative;
  grid-area: header;
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacings(3)};
  background: ${({ theme }) => theme.ui.background};
  border-bottom: 1px solid ${({ theme }) => theme.ui.backgroundInverse};
  .logo {
    height: 35px;
  }
`;

export const Page = styled.section`
  display: grid;
  height: calc((var(--vh, 1vh) * 100));
  background: ${({ theme }) => theme.ui.backgroundGrey};
  grid-template-areas:
    "header  header  header"
    "sidebar content content"
    "sidebar  footer  footer";
  grid-template-columns: 345px 1fr 1fr;
  grid-template-rows: 50px 1fr 150px;
`;

export const Content = styled.section`
  grid-area: content;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacings(5)};
`;
