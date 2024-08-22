import styled from "styled-components";
import { FormCheck } from "react-bootstrap";
import { Button, ButtonAlt } from "components/shared/Button";

// ItemWrapper com rolagem horizontal e padding
export const ItemWrapper = styled.div`
  margin-bottom: 15px;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;
  border-radius: 5px;

  transition: 0.3s;

  &:hover {
		border-color: rgba(0, 0, 0, 0.2);
	}
`;

// Item com rolagem horizontal em telas pequenas
export const Item = styled.div<{ header?: boolean }>`
  width: 100%;
  display: grid;
  grid-template-columns: 45px 1fr 1fr 1fr 1fr 1fr 30px;
  column-gap: 15px;
  align-items: center;

  margin-top: 5px;
  padding: 0;
  padding-right: 15px;

  ${({ header }) => !header && "margin: 0;"}

  .id, .name {
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    grid-template-columns: 45px minmax(0, 2fr) 1fr 30px;
    column-gap: 5px;
    padding-right: 5px;
  }
  @media (max-width: 575px) {
    grid-template-columns: 35px minmax(0, 2fr) 1fr 30px;
  }
`;

// Botão para exibir a seta
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

export const Column = styled.div<{ hideOnMobile?: boolean, color?: string }>`
  color: ${({ color }) => color ? color : "var(--text-default)"};
	padding: 0;

	white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;

	i {
		vertical-align: top;
		font-size: 0.875rem;
		margin-right: 10px;
	}

  @media (max-width: 768px) {
    ${({ hideOnMobile }) => hideOnMobile && "display: none;"}
  }
`;

export const CollapseDetailsStyled = styled.div<{ admin: boolean }>`
  background-color: var(--white-1);
  padding: 10px 20px 15px;
  border-radius: 0 0 5px 5px;

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

export const SubmissionStatusStyled = styled.div`
  p {
    margin-bottom: 5px;
  }

  & > div {
    display: grid;
    grid-template-columns: 20px 20px 20px;
    grid-gap: 5px;
  }
`;

const coloredBarColors = {
  "g": "var(--primary-color)",
  "r": "var(--danger)",
  "w": "var(--white-5)"
};

export const ColoredBar = styled.div<{ color: string }>`
  width: 20px;
  height: 3px;
  background-color: ${({ color }) => coloredBarColors[color]};
`;

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

export const FileInfo = styled(Info)`
  width: 100%;
  overflow: hidden;

  a {
    overflow: hidden;
    word-break: break-all;

    position: relative;
    display: flex;
    align-items: center;
    padding: 10px;

    color: var(--text-default);
    border-radius: 5px;
    border: 1px solid var(--white-5);

    transition: 0.3s;

    i {
      font-size: 2rem;
      margin-right: 10px;
    }

    p {
      margin-bottom: 0px;
      transition: 0.3s;
    }
    span {
      margin: 0;
      color: var(--muted);
      font-size: 0.875rem;
    }

    & > div i {
      position: absolute;
      bottom: 12px;
      right: 0px;
      color: var(--muted);
      font-size: 0.875rem;
    }

    &:hover {
      border-color: var(--primary-color-2);

      & > div i {
        color: var(--primary-color-2);
      }
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`;

export const ButtonGroupTop = styled.div`
  width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
  gap: 10px;

	margin-top: 15px;
`;

export const ButtonGroupBottom = styled.div`
  width: 100%;
  display: grid;
  justify-content: flex-end;
  align-items: flex-start;
  grid-template-columns: repeat(4, 0fr);
  grid-gap: 10px;
  
  margin-top: 15px;
  
  @media (max-width: 768px) { 
    grid-template-columns: repeat(2, 1fr);
    padding-top: 15px;
    grid-gap: 10px;

    & > button {
      padding: 8px !important;
    }
  }
`;

export const AcceptButton = styled(Button)`
  width: fit-content;
  padding: 8px 26px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const EditButton = styled(ButtonAlt)`
  width: fit-content;
  padding: 8px 26px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const InfoButton = styled(ButtonAlt)`
  width: fit-content;
  padding: 8px 26px;
  color: var(--success);

  &:hover {
    color: var(--success-hover);
    border-color: var(--success-hover);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const DangerButtonAlt = styled(ButtonAlt)`
  width: fit-content;
  padding: 8px 26px;
  color: var(--danger);

  &:hover {
    color: var(--danger-hover);
    border-color: var(--danger-hover);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const WarningButtonAlt = styled(ButtonAlt)`
  width: fit-content;
  padding: 8px 26px;
  margin-left: 10px;
  color: var(--warning-hover);

  &:hover {
    color: var(--warning);
    border-color: var(--warning);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;
