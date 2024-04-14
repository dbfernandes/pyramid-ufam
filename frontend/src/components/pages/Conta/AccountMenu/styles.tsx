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
`;

export const CustomSidenav = styled(SidenavWrapper)`
  width: 100%;
  box-shadow: none;
`;
export const CustomLinkWrapper = styled(SidenavLinkWrapper)`
  &:last-child {
    padding: 10px;
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
`;