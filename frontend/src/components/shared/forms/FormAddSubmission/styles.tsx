import styled from "styled-components";

export const ParagraphTitle = styled.p`
	margin: 25px 0 15px;
`;

export const RangeWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;