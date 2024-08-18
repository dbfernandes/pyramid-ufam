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
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 25px;
  justify-items: center;
  padding-top: 10px;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    overflow-y: auto;
    overflow-x: auto;
    padding-left: 10px;
    padding-right: 10px;
  }
  
  @media (min-width: 769px) {
    overflow: visible;
  }
`;
