import styled from "styled-components";
import { Info, Item } from "components/shared/Table";

export const CustomItem = styled(Item) <{ header?: boolean, admin?: boolean }>`
  grid-template-columns: 45px ${({ admin }) => admin ? "30px" : ""} 2fr ${({ admin }) => admin ? "2fr" : ""} 1fr 1fr 1fr 1fr 30px;

  @media (max-width: 768px) {
    grid-template-columns: 45px ${({ admin }) => admin ? "40px" : ""} minmax(0, 2fr) 1fr 4px;
  }
  @media (max-width: 575px) {
    grid-template-columns: 35px ${({ admin }) => admin ? "40px" : ""} minmax(0, 2fr) 1fr 30px;
  }
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
