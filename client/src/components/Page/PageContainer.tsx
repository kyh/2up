import styled, { css } from 'styled-components';

enum Variants {
  tv = 'tv',
  remote = 'remote'
}

type Props = {
  variant?: keyof typeof Variants;
};

const renderTVStyles = () => {
  return css`
    max-width: 900px;
    align-items: center;
  `;
};

const renderRemoteStyles = () => {
  return css`
    max-width: 600px;
  `;
};

export const PageContainer = styled.section<Props>`
  display: flex;
  padding: ${({ theme }) => theme.spacings(4)};
  margin: 0 auto;
  justify-content: center;
  height: 100vh;

  ${({ variant }) =>
    variant === Variants.tv ? renderTVStyles() : renderRemoteStyles()}
`;
