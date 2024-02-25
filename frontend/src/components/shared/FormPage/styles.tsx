import styled from "styled-components";

export const FormWrapper = styled.div<{ fullscreen: boolean }>`
	width: 100%;
	background-color: var(--white-1);
	padding: 25px;
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	display: flex;
	justify-content: ${({ fullscreen }) => fullscreen ? "left" : "center"};

	& > div {
		width: 60%;

		& > form {
			display: flex;
			flex-direction: column;
			align-items: baseline;
	
			p {
				color: var(--muted);
				margin-bottom: 10px;
			}
		}
	}	
`;

export const FormAlert = styled.div`
	width: 100%;
	margin-top: 15px;
	
	font-weight: 300;
	color: var(--danger);
  text-align: center;

	transition: 0.3s;

	&:empty {
		opacity: 0;
	}
	&:not(:empty) {
		animation: fade-in 0.2s forwards;

		@keyframes fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}

	&::first-letter {
		text-transform: capitalize;
	}
`;

export const LinkWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;

	margin-top: 30px;
	padding-top: 20px;

	border-top: 1px solid var(--white-2);

	a, button {
    padding: 0;
    background: none;
    outline: none;
    border: none;
		color: var(--primary-color);
		text-decoration: none;

		transition: 0.3s;

		&:hover {
			color: var(--primary-color-2);
		}
	}

  span {
    margin: 0 10px;
  }
`;

export const Disclaimer = styled.p`
  color: var(--muted);
`;