import styled from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    typography: {
      h1: {
        fontSize: string;
        lineHeight: string;
      };
      h2: {
        fontSize: string;
        lineHeight: string;
      };
      h3: {
        fontSize: string;
        lineHeight: string;
      };
    };
    colors: {
      black: string;
      lightGrey: string;
      grey: string;
      darkGrey: string;
      white: string;
      purple: string;
    };
    border: {
      wavyRadius: string;
    };
    space: Array<number>;
    spacings: (spacing: number) => string;
  }
}
