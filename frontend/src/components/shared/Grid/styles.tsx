import styled from "styled-components";

export const GridStyled = styled.div`
	display: grid;
	grid-gap: 16px;
	grid-template-columns: repeat(4, 1fr);

	@media only screen and (max-width: 1024px) {
		grid-template-columns: repeat(3, 1fr);
	}

	@media only screen and (max-width: 575px) {
		grid-template-columns: repeat(1, 1fr);
	}
`;