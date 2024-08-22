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
export const Item = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 1fr 1fr 45px;
  column-grid-gap: 15px;
  align-items: center;
  margin-top: 5px;
  padding: 0;

  ${props => !props.header && "margin: 0; margin-bottom: -5px;"}

  .id, .name {
    transition: 0.3s;
  }

  @media (max-width: 768px) {
    grid-template-columns: 60px 2fr 1fr 45px;
  }
`;


export const HideOnSmallScreen = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

// Wrapper para o select e a seta
export const ToggleWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
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

export const Column = styled.div`
	color: ${props => props.color ? props.color : "var(--text-default)"};
	padding: 15px;

	white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;

	i {
		vertical-align: top;
		font-size: 0.875rem;
		margin-right: 10px;
	}

`;

export const CollapseDetailsStyled = styled.div<{ admin: boolean }>`
  background-color: var(--white-1);
  padding: 10px 20px 15px;
  border-radius: 0 0 5px 5px;

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

export const ButtonGroup = styled.div`
  width: 100%;
  display: grid;
  justify-content: flex-end;
  justify-items: end !important;
  align-items: flex-start;
  grid-template-columns: repeat(4, 0fr);
  grid-gap: 10px;
  
  margin-top: 15px;
  
  @media (max-width: 768px) { 
    grid-template-columns: repeat(2, 1fr);
    padding-top: 15px;
    grid-gap: 10px;
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

export const DangerButtonMult = styled(ButtonAlt)`
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

export const DangerButtonAlt = styled(ButtonAlt)`
  width: fit-content;
  padding: 8px 26px;
  color: var(--danger);
  .cancelar {
    margin-left: 10px;
  }

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
