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

  @media (max-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }
  @media (max-width: 992px) {
    grid-template-columns: 1fr 2fr;
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }
`;

export const CustomSidenav = styled(SidenavWrapper)`
  width: 100%;
  box-shadow: none;
  margin: 0;

  @media (max-width: 768px) {
    padding: 10px 0 15px;
  }
`;

export const CustomLinkWrapper = styled(SidenavLinkWrapper)`
  &:last-child {
    padding: 10px;
  }

  @media (max-width: 768px) {
    div {
      display: grid;
      grid-template-columns: 1fr;
    }

    &:last-child {
      padding: 0;
    }
  }
`;

export const CustomSidenavButton = styled(SidenavButtonStyled) <{ active: boolean }>`
  position: relative;
  margin-left: 5px;
  display: flex;
  margin-bottom: 10px;
  
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
    margin-left: 0;
    width: 100%;
    
    &:before {
      display: none;
    }
    background-color: ${({ active }) => active ? 'var(--primary-color-background)' : 'inherit'};
  }
`;


