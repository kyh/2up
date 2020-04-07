import React from "react";
import styled from "styled-components";
import { Icon, iconMap } from "./Icon";
import { Box } from "components";
import { withContainer } from "components/Storybook/utils";

export default {
  title: "Icon",
  component: Icon,
  decorators: [withContainer],
};

const iconKeys = Object.keys(iconMap) as Array<keyof typeof iconMap>;

export const all = () => {
  return (
    <Box display="flex" flexWrap="wrap" justifyContent="center">
      {iconKeys.map((k) => (
        <IconContainer key={k}>
          <Box mb={3}>
            <Icon icon={k} />
          </Box>
          <span>{k}</span>
        </IconContainer>
      ))}
    </Box>
  );
};

const IconContainer = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacings(5)};
  width: 150px;
  height: 120px;
`;
