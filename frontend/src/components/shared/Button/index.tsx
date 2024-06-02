import styled from "styled-components";

export const Button = styled.button`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	padding: 12px 20px;

	color: var(--white-1);
	background-image: linear-gradient(to right, var(--primary-color) 0%, #2ddabd 51%, var(--primary-color-2) 100%);
	background-size: 200% auto;

	font-size: 1rem;
  font-weight: 500;
	text-shadow: 0px 2px 6px rgba(84, 16, 95, 0.13);
	line-height: 20px;
	
	border-radius: 5px;
	border: 1px solid transparent;
	outline: none;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	transition: 0.3s;

  & > i {
    margin-right: 10px;
  }

	&:hover {
		background-position: right center;
	}
`;

export const ButtonAlt = styled(Button)`
  border: 1px solid transparent;
  background: var(--white-1);
  color: var(--primary-color);

  &:hover {
		color: var(--primary-color-2);
		border-color: var(--primary-color-2);
	}
`;

export const DangerButton = styled(Button)`
  background-image: linear-gradient(to right, var(--danger) 0%, #da2d58 51%, var(--danger-hover) 100%);
`;