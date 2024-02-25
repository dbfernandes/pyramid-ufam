import styled from "styled-components";

export const FormWrapper = styled.div<{ fullscreen: boolean }>`
	width: 100%;
	background-color: var(--white-1);
	padding: 50px;
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	& > form {
    ${({ fullscreen }) => fullscreen && "min-height: calc(100vh - 170px);"}

		display: flex;
		flex-direction: column;
		align-items: baseline;
    ${({ fullscreen }) => fullscreen && "justify-content: space-between;"}

    p {
      color: var(--muted);
      margin-bottom: 10px;
    }
	}

  @media (max-width: 992px) {
    width: 100%;
    padding: 20px;
		margin: 25px 0;
    
    & > form {
      flex-direction: column;
      ${({ fullscreen }) => fullscreen && "min-height: calc(100vh - 120px);"}
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

export const MultiField = styled.div<{ customGrid?: string }>`
	width: 100%;
	position: relative;
	display: grid;
	grid-template-columns: ${({ customGrid }) => customGrid || "1fr 1fr"};
	grid-gap: 20px;
`;

export const SectionTitle = styled.p`
	position: relative;
	font-size: 0.875rem;
	color: var(--text-default) !important;

	padding: 0 5px;
`;

export const LinkWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;

	margin-top: 30px;
	padding-top: 20px;

	border-top: 1px solid var(--white-3);

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