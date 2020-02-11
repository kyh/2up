import styled from 'styled-components';

enum Size {
  small = 'small',
  large = 'large',
  full = 'full'
}

type Props = {
  size?: keyof typeof Size;
  align?: 'start' | 'center' | 'end' | 'stretch';
};

const renderSize = ({ size }: Props) => {
  if (size === Size.small) {
    return '600px';
  }
  if (size === Size.large) {
    return '900px';
  }
  return 'none';
};

export const PageContainer = styled.section<Props>`
  display: flex;
  padding: ${({ theme }) => theme.spacings(4)};
  margin: 0 auto;
  justify-content: center;
  height: 100vh;
  max-width: ${renderSize};
  align-items: ${({ align }) => (align ? align : 'start')};
`;
