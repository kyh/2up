import React from "react";
import styled from "styled-components";
import { gql } from "apollo-boost";
import { ActTemplateFragment } from "./__generated__/ActTemplateFragment";

type ActTemplateProps = {
  act: ActTemplateFragment;
  onClick(): void;
};

export const ActTemplate = ({ act }: ActTemplateProps) => {
  return <ActTemplateContainer>{act?.node?.question}</ActTemplateContainer>;
};

ActTemplate.fragments = {
  act: gql`
    fragment ActTemplateFragment on ActEdge {
      node {
        id
        question
        answer
      }
    }
  `,
};

const ActTemplateContainer = styled.div`
  width: 150px;
  background: ${({ theme }) => theme.ui.background};
  height: 100%;
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-right: ${({ theme }) => theme.spacings(4)};
  border: 2px solid ${({ theme }) => theme.ui.backgroundInverse};
`;
