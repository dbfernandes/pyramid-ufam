import styled from 'styled-components';
import { Button, ButtonAlt } from "components/shared/Button";



export const ButtonGroupTop = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
  gap: 10px;

  & > button {
    margin: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    margin-top: 15px;
  }
`;

export const ButtonGroupBottom = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 10px;
  
  margin-top: 15px;
  
  @media (max-width: 768px) {
    display: grid;
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