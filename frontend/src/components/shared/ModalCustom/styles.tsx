import styled from "styled-components";

export const ModalClose = styled.button`
	position: absolute;
	top: 30px;
	right: 30px;

	background-color: transparent;
	color: var(--muted);
	outline: none;
	border: none;

	&:hover {
		color: var(--text-default);
	}

	@media only screen and (max-width: 575px) {
		top: 15px;
		right: 15px;
	}
`;