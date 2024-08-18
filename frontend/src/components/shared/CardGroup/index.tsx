import styled from "styled-components";

const CardGroup = styled.div<{ grid: string }>`
	margin-top: 25px;
	display: grid;
	grid-template-columns: ${({ grid }) => grid ? grid : "repeat(4, 1fr)"};
	grid-gap: 25px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 575px) {
    grid-template-columns: 1fr;
  }
`;

export default CardGroup;