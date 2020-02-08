import styled from 'styled-components/macro';

export const SubmissionsContainer = styled.div`
  padding: 40px;
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas:
    's1 . s3 . s4'
    '. s2 . s7 .'
    '. . . . .'
    '. s8 . s10 .'
    's6 . s5 . s9';

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .s1 {
    grid-area: s1;
  }
  .s2 {
    grid-area: s2;
  }
  .s3 {
    grid-area: s3;
  }
  .s4 {
    grid-area: s4;
  }
  .s5 {
    grid-area: s5;
  }
  .s6 {
    grid-area: s6;
  }
  .s7 {
    grid-area: s7;
  }
  .s8 {
    grid-area: s8;
  }
  .s9 {
    grid-area: s9;
  }
  .s10 {
    grid-area: s10;
  }
`;
