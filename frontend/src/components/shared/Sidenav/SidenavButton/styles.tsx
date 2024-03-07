import styled from "styled-components";

export const SidenavButtonStyled = styled.button`
	width: 100%;
	display: flex;
	align-items: center;

	color: var(--text-default);
	background-color: transparent;
	padding: 10px;
	border-radius: 5px;
	outline: none;
	border: none;

	& > i {
    font-size: 1rem;
	}

  & > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 10px;
  }

	transition: 0.3s;
	&:hover {
		color: var(--primary-color-2);
		background: var(--primary-color-2-background);
	}
`;