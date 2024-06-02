import styled from "styled-components";

export const Wrapper = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 3fr 125px;
	grid-gap: 15px;
	align-items: center;

	input[type="range"] {
		width: 100%;
	}
`;

export const CustomInputWrapper = styled.div`
	position: relative;
	width: 125px;

	input {
		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
		&[type=number] {
			-moz-appearance: textfield;
		}

		&:focus-visible {
			outline: none;
		}

		width: 100%;
		height: 44px;
		padding: 10px;
		padding-right: 85px;

		border-radius: 5px;
		border: none;
		background-color: var(--white-2);
		color: var(--text-default);

		transition: 0.3s;
	}

	span {
		position: absolute;
		top: 5px;
		right: 5px;

		padding: 5px 10px;

		border-radius: 5px;
		color: var(--muted);
		background-color: var(--white-1);
		box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
	}
`;