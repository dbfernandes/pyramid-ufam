import styled from "styled-components";
import { SidenavButtonStyled } from "./SidenavButton/styles";
import { OverlayTrigger } from "react-bootstrap";

export const Burger = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 5px;
  color: var(--muted);
  font-size: 1.5rem;
  cursor: pointer;

  transition: 0.3s;

  &:hover {
		color: var(--primary-color-2);
		background: var(--primary-color-2-background);
	}
`;

export const Wrapper = styled.div <{ sidenavOpen: boolean }> `
	width: ${({ sidenavOpen }) => (sidenavOpen ? "280px" : "73px")};
  height: calc(100% - 20px);

	position: sticky;
	top: 0;
  left: 15px;
	overflow-y: auto;
  overflow-x: hidden;
	z-index: 10;
	margin: 10px 0;

	background-color: var(--white-1);
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

  transition: 0.2s;

	& > div {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		padding: 0 15px 15px;
	}

  ::-webkit-scrollbar-thumb {
    background-color: var(--white-5);
    border-radius: 10px;
    transition: 0.3s;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
    cursor: pointer;
  }

  ${Burger} {
    ${({ sidenavOpen }) => !sidenavOpen && `margin-left: 5px;`}
  }
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin: 20px 0;
`;

export const Logo = styled.img`
	align-self: flex-start;
	height: 35px;
	width: auto;
	object-fit: contain;
`;

export const NestedIcon = styled.div`
  position: relative;

  i {
    font-size: 1rem;
  }

  i:nth-child(2) {
    position: absolute;
    bottom: 0;
    right: -5px;

    font-size: calc(0.75rem - 0.05rem);
    width: 0.75rem;
    height: 0.75rem;
    padding: 0.05rem;

    background: var(--white-1);
  }
`;

export const SidenavLink = styled.a`
	position: relative;
	width: 100%;
	display: flex;
	align-items: center;
  justify-content: flex-start;

	text-decoration: none;
	color: var(--text-default);
	padding: 10px;
	border-radius: 5px;

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

    & > ${NestedIcon} {
      i:nth-child(2) {
        background: var(--primary-color-2-background);
      }
    }
	}
`;

export const LinkWrapper = styled.div<{ route: string, sidenavOpen: boolean }>`
  position: relative;
  
	h3 {
		margin: 10px 0;
		font-size: 0.75rem;
		text-transform: uppercase;
	}

  &:last-child {
    padding-bottom: 15px;
  }

  ${SidenavLink}, ${SidenavButtonStyled} {
    height: 44px;

    ${({ sidenavOpen }) => !sidenavOpen && `
      width: 44px;

      display: flex;
      align-items: center;
      justify-content: center;

      & > i {
        font-size: 1.125rem;
      }
    `}
  }

	${SidenavLink}[href="${({ route }) => route}"] {
    color: var(--primary-color) !important;
    background: var(--primary-color-background) !important;

    & > ${NestedIcon} {
      i:nth-child(2) {
        background: var(--primary-color-background);
      }
    }

    &:before {
    	position: absolute;
    	top: 0;
    	left: -15px;

    	height: 44px;
    	width: 5px;
    	border-radius: 0 5px 5px 0;
    	background-color: var(--primary-color);
    	content: "";
    }
	}
`;