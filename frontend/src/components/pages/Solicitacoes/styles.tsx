import styled from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	padding: 25px;

	background-color: var(--white-1);
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
`;

export const HeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;

	& > h3 {
		width: fit-content;
	}
`;

export const ListStyled = styled.div`
	display: block;
	margin-top: 15px;
`;