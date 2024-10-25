import styled from "styled-components";
import { FormCheck } from "react-bootstrap";

// ItemWrapper with horizontal scroll and padding
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

// Item with horizontal scroll in small screens
export const Item = styled.div<{ header?: boolean, student: boolean }>`
  width: 100%;
  display: grid;
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
    column-gap: 5px;
    padding-right: 5px;
  }
`;

// Botão para exibir a seta no CollapseDetails
export const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--primary-color);

  &:focus {
    outline: none;
  }

  i {
    transition: transform 0.3s;
    transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  }
`;

// Responsive user profile picture
export const UserProfilePicture = styled.img<{ big?: boolean }>`
  width: ${({ big }) => big ? "100px" : "30px"};
  height: ${({ big }) => big ? "100px" : "30px"};
  border-radius: 50%;

  margin-bottom: ${({ big }) => big ? "15px" : "0"};
`;

// Custom form check button
export const CheckboxPreventClick = styled.div`
  width: 100%;
  height: 100%;
  content: "";
`;

export const CustomFormCheck = styled(FormCheck)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 0;
  padding: 15px;
  
  & > input {
    background-color: var(--white-1);
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

// Custom collapse wrapper
export const CollapseDetailsStyled = styled.div<{ admin: boolean }>`
  background-color: var(--white-1);
  padding: 10px 20px 15px;
  border-radius: 0 0 5px 5px;

  cursor: auto;

  @media (max-width: 768px) {
    padding: 10px;
  }

  & > .grid {
    display: grid;
    grid-template-columns: 3fr 3fr 3fr;
    grid-gap: 30px;

    @media (max-width: 1200px) {
      grid-gap: 15px;
    }
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

// Custom info card
export const Info = styled.div`
  padding: 20px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;

  & > h6 {
    font-size: 1.125rem;
    margin-bottom: 15px;
  }
  & > p {
    margin-bottom: 5px;
  }
`;

export * from './Buttons';
export * from './Column';
export * from './CopyToClipboard';
export * from './Dropdown';
export * from './ProgressBar';