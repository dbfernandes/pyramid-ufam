import styled from "styled-components";

export const WrapperStyled = styled.div<{ centerAlign?: boolean, maxWidth?: number }>`
	width: 100%;
	display: flex;
  
	margin-top: 15px;
	
	margin-bottom: 50px;

	${({ centerAlign, maxWidth }) => centerAlign && `
		min-height: 100vh;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 0 15px;
		margin: 0;
		
		& > div {
			width: 100%;
			height: 100%;
			max-width: ${maxWidth}px;

			display: flex;
			justify-content: center;
			flex-direction: column;

			padding: 0 30px;

			@media only screen and (max-width: 575px) {
				padding: 0;
			}

			animation: slide 0.5s forwards;

			@keyframes slide {
				from {
					opacity: 0;
					margin-top: 50px;
				}
				to {
					opacity: 1;
					margin-top: 0;
				}
			}
	}`
  }
	${({ centerAlign }) => !centerAlign &&
    `& > div { width: 100%; }`
  }
`;

export const DefaultWrapper = styled.div`
  width: 100%;
	padding: 25px 25px;

	background-color: var(--white-1);
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
`;