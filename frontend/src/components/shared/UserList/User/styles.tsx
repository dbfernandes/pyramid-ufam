import styled from "styled-components";
import { Dropdown, FormCheck, ProgressBar } from "react-bootstrap";

export const ItemWrapper = styled.div`
  margin-bottom: 15px;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  border-radius: 5px;

  transition: 0.3s;

  &:hover {
		border-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
	}
`;

export const Item = styled.div<{ header?: boolean, student: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 45px 30px ${({ student }) => student ? "2fr 1fr 1fr 1fr 1fr 1fr" : "3fr 3fr 3fr"} 60px 30px 30px;
  column-gap: 15px;
  align-items: center;

  margin-top: 5px;
  padding: 0;
  padding-right: 15px;
  border: 1px solid transparent;

  ${({ header }) => !header && "margin: 0;"}

  .id, .name {
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    grid-template-columns: 45px 40px ${({ student }) => student ? "minmax(0, 2fr) 1fr" : "3fr"} 30px 30px;
    column-gap: 5px;
    padding-right: 5px;
  }
  @media (max-width: 575px) {
    grid-template-columns: 35px 40px ${({ student }) => student ? "minmax(0, 2fr) 1fr" : "3fr"} 30px 30px;
  }
`;

export const Column = styled.div<{ hideOnMobile?: boolean, color?: string }>`
  color: ${({ color }) => color ? color : "var(--text-default)"};
  padding: 0;
  
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;

  .text-with-ribbon {
    display: flex;
    
    span {
      white-space: nowrap; 
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  & > .placeholder {
    color: var(--white-5);
  }

  @media (max-width: 768px) {
    ${({ hideOnMobile }) => hideOnMobile && "display: none;"}
  }
`;

export const UserProfilePicture = styled.img<{ big?: boolean }>`
  width: ${({ big }) => big ? "100px" : "30px"};
  height: ${({ big }) => big ? "100px" : "30px"};
  border-radius: 50%;

  margin-bottom: ${({ big }) => big ? "15px" : "0"};
`;

export const CopyToClipboardSpan = styled.span`
  cursor: pointer;
  transition: 0.3s;
  
  &:hover {
    color: var(--primary-color-2);
  }
  
  & > i {
    margin-left: 5px;
    font-size: 0.75rem;
    vertical-align: text-top;
  }
`;

export const Ribbon = styled.div<{ left: number }>`
  padding: 5px;
  margin-left: 10px;

  font-weight: 600;
  font-size: 0.85rem;

  color: var(--primary-color);
  background: var(--primary-color-background);
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 4px;
    margin-left: 8px;
  }
`;

export const DropdownMenu = styled(Dropdown.Menu)`
  z-index: 10;

  padding: 10px 0;

  background-color: var(--white-1);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

export const DropdownItem = styled(Dropdown.Item) <{ accent?: string }>`
  padding: 7.5px 15px;

  font-size: 0.875rem;
  color: var(--text-default) !important;
  border-left: 3px solid transparent;

  transition: 0.3s;

  i {
    vertical-align: top;
    margin-right: 5px;
  }

  &:hover {
    background-color: var(--white-2);
    border-color: ${({ accent }) => accent ? accent : "var(--primary-color)"};

    i {
      color: ${({ accent }) => accent ? accent : "var(--primary-color)"};
    }
  }
`;

export const Options = styled(Dropdown.Toggle)`
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;

  font-size: 1.75rem;
  background-color: transparent !important;
  color: var(--muted);
  border: none !important;
  outline: none !important;

  transition: 0.3s;

  &:hover, &:focus {
    color: var(--primary-color-2);
    box-shadow: none !important;
  }
  &:focus, &[aria-expanded=true] {
    color: var(--primary-color) !important;
  }
  &:after {
    display: none;
  }
`;

export const CustomFormCheck = styled(FormCheck)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0;
  padding: 15px;

  & > input {
    margin: 0 !important;
    padding: 7.5px;
    z-index: 1;
    transition: 0.3s;

    &:checked {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
    }

    &:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.25rem rgba(34, 201, 159, .25);
    }
  }

  .form-check-label {
    position: absolute;
    width: 100%;
    height: 100%;
  }
`;

export const CheckboxPreventClick = styled.div`
  width: 100%;
  height: 100%;
  content: "";
`;

export const UserStatus = styled.span`
  padding: 5px;

  font-weight: 600;
  font-size: 0.85rem;

  color: ${(props) => (props.status === true ? 'var(--primary-color)' : 'var(--danger)')};
  background: ${(props) =>
    props.status === true
      ? 'var(--primary-color-background)'
      : 'color-mix(in srgb, var(--danger) 10%, transparent)'};
  border-radius: 5px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 4px;
  }
`;

export const CustomProgressBarWrapper = styled.div`
  width: 100%;
  position: relative;

  & > span {
    width: 100%;
    position: absolute;
    top: 0%;
    left: 50%;

    text-align: center;
    font-weight: bold;
    color: var(--white-1);
    font-size: 0.75rem;
    transform: translateX(-50%);
  }
`;
export const CustomProgressBar = styled(ProgressBar) <{ background?: string }>`
  height: 15px;
  border-radius: 8px;
  ${({ background }) => `background-color: ${background};`}
`;