import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  
	p {
		margin-bottom: 0;
    color: var(--muted);
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
`;