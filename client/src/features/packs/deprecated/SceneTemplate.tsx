import React from "react";
import styled from "styled-components";
import { gql } from "@apollo/client";
import { SceneTemplateFragment } from "./__generated__/SceneTemplateFragment";

type Props = {
  act: SceneTemplateFragment;
  onClick(): void;
};

export const SceneTemplate = ({ act }: Props) => {
  return <SceneTemplateContainer>{act?.node?.question}</SceneTemplateContainer>;
};

SceneTemplate.fragments = {
  act: gql`
    fragment SceneTemplateFragment on ActEdge {
      node {
        id
        question
        answer
      }
    }
  `,
};

const SceneTemplateContainer = styled.div`
  width: 150px;
  background: ${({ theme }) => theme.ui.background};
  height: 100%;
  border-radius: ${({ theme }) => theme.border.wavyRadius};
  margin-right: ${({ theme }) => theme.spacings(4)};
  border: 2px solid ${({ theme }) => theme.ui.backgroundInverse};
`;
