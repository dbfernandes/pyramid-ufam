import { ButtonAlt } from "components/shared/Button";
import styled from "styled-components";

export const TileWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  border-radius: 5px;
  background-color: var(--white-1);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid transparent;

  & > div > p {
    color: var(--muted);
    margin: 10px 0 0;
  }

  span {
    height: fit-content;
    padding: 2px 5px;
    margin-left: 5px;
    word-break: keep-all;

    font-size: 0.75rem;
    color: var(--muted);
    border: 1px solid var(--muted);
    border-radius: 5px;
  }

  transition: 0.3s;
`;

export const CallToAction = styled(ButtonAlt)`
  padding: 8px 26px;
	margin-top: 25px;
`;