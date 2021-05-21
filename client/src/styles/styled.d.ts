// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styled from "styled-components";

declare module "styled-components" {
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
      red: string;
    };
    space: Array<number>;
    media: {
      desktop: (...args: any[]) => FlattenSimpleInterpolation;
      isDesktop: () => boolean;
    };
    spacings: (spacing: number) => string;
    border: {
      color: string;
      alternateColor: string;
      wavyRadius: string;
    };
    ui: {
      text: string;
      lightText: string;
      background: string;
      backgroundGrey: string;
      backgroundInverse: string;
      card: {
        border: string;
      };
      button: {
        color: string;
        background: string;
        border: string;
      };
      modal: {
        border: string;
        background: string;
      };
      alert: {
        text: string;
        background: string;
      };
    };
  }
}
