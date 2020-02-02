import styled from 'styled-components';

declare module 'styled-components/macro' {
  export * from 'styled-components';
  export default styled;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      black: string;
      lightGrey: string;
      white: string;
    };
    space: Array<number>;
    spacings: (spacing: number) => string;
  }
}
