import styled from "styled-components";
import {
  Wrapper as SidenavWrapper,
  LinkWrapper as SidenavLinkWrapper
} from "components/shared/Sidenav/styles";
import { SidenavButtonStyled } from "components/shared/Sidenav/SidenavButton/styles";

export const AccountMenuWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CustomSidenav = styled(SidenavWrapper)`
  width: 100%;
  box-shadow: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
`;

export const CustomLinkWrapper = styled(SidenavLinkWrapper)`
  &:last-child {
    padding: 10px;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const CustomSidenavButton = styled(SidenavButtonStyled) <{ active: boolean }>`
  position: relative;
  margin-left: 5px;

  ${({ active }) => active && `
    color: var(--primary-color) !important;
    background: var(--primary-color-background) !important;

    &:before {
      position: absolute;
      top: 0;
      left: -15px;

      height: 43px;
      width: 5px;
      border-radius: 0 5px 5px 0;
      background-color: var(--primary-color);
      content: "";
    }
  `}

  @media (max-width: 768px) {
    margin-bottom: 10px; /* Adiciona espaço entre os botões */
    width: 100%; /* Ajusta a largura dos botões em telas pequenas */
    text-align: center; /* Centraliza o texto */

    
  }
`;
