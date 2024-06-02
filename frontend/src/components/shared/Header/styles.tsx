import styled from "styled-components";

export const Wrapper = styled.div`
	/*width: calc(100% - 325px);

	position: absolute;
	right: 15px;
	top: 10px;*/
	overflow: auto;
	z-index: 10;

	background-color: var(--white-1);
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	& > div {
		height: 100%;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 10px;
    padding-left: 20px;

    @media (max-width: 992px) {
      padding: 10px;
    }
	}
`;

export const HeaderMobile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  overflow: auto;
	z-index: 10;
  padding: 5px;
  margin-bottom: 15px;

	background-color: var(--white-1);
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

  & > div {
    display: flex;
    align-items: center;
  
  }
`;

export const Logo = styled.img`
	height: 25px;
	width: auto;
	object-fit: contain;
`;

export const SidenavWrapper = styled.div`
	position: fixed;
	z-index: 9998;
	top: 0;
  bottom: 0;
	left: ${props => props.show ? "0" : "-75%"};
	
  max-height: calc(100vh);
	width: fit-content;

	background-color: var(--white-1);
  overflow-Y: auto;
	word-wrap: break-word;
	white-space: nowrap;

	transition: 0.3s;

  /* Hiding scrollbar on all browsers */
  &::-webkit-scrollbar { /* WebKit */
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */

  & > div {
    height: 100%;
  }
  & > div > div {
    margin: 0;
  }

	.buttonWrapper {
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 15;

		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 50px;

		padding-right: 2px;

		button.close {
			color: var(--muted);
			font-size: 1.4rem;
			background-color: transparent;
			border: none;

			transition: 0.3s;

			&:hover {
				color: var(--primary-color-2);
			}
		}
	}
`;

export const SidenavBackground = styled.div`
	position: fixed;
	z-index: 9997;
	top: 0;
	left: 0;
	height: 150%;
	width: 100%;

	background-color: rgba(0, 0, 0, 0.5);
	opacity: ${props => props.show ? 1 : 0};

	transition: 0.3s;
`;