import styled from "styled-components";

export const CardGroup = styled.div<{ grid: string }>`
	margin-top: 25px;
	display: grid;
	grid-template-columns: ${({ grid }) => grid ? grid : "repeat(4, 1fr)"};
	grid-gap: 25px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 575px) {
    grid-template-columns: 1fr;
  }
`;

export const AddActivityButton = styled.button`
	position: relative;
	padding: 20px;
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	display: flex;
	justify-content: center;
	align-items: center;

	font-size: 2.5rem;
	color: var(--primary-color);
	background: none;
	outline: none;
	border: 1px solid transparent;

	transition: 0.3s;

	&:hover {
		color: var(--primary-color-2);
		border-color: rgba(0, 0, 0, 0.2);
	}
`;