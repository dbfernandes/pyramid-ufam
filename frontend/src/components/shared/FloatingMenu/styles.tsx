import styled from "styled-components";
import { Button, ButtonAlt } from "../Button";
import { Collapse } from "react-bootstrap";

export const Wrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.3s;

  & > div {
    display: flex;
    align-items: center;
    gap: 50px;
  }
`;

export const AddButton = styled(Button)`
	width: 45px;
  height: 45px;
	display: flex;
	align-items: center;

  font-size: 2rem;
  border-radius: 50%;
`;

export const MoreOptionsButton = styled(ButtonAlt)`
	width: 45px;
  height: 45px;
	display: flex;
	align-items: center;

  background-color: var(--white-1);
  font-size: 2rem;
  border-radius: 50%;
`;

export const CollapseCustom = styled(Collapse)`
  position: absolute;
  bottom: 60px;
  left: calc(30vw + 5px);
  z-index: 10;
  width: 100%;
  max-width: 200px;

  div {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

export const CollapseButton = styled(MoreOptionsButton) <{ color: string }>`
  height: 40px;
  width: fit-content;
  position: relative;

  padding: 5px 15px;
  border-radius: 30px;
  border: none;
	font-size: 0.875rem;
  color: ${({ color }) => color ? color : "var(--text-default)"};

  line-height: 1rem;

  i {
    font-size: 1rem;
    margin-right: 10px;
  }
`;