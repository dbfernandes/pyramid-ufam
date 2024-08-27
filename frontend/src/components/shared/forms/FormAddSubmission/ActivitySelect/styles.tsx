import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  
  p {
    margin-bottom: 0;
  }

  & > div + p {
    margin-top: 35px;
  }
`;

export const CardGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 25px;
  justify-items: center;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 15px;
  }

  @media (max-width: 575px) {
    grid-template-columns: 1fr;
  }
`;
