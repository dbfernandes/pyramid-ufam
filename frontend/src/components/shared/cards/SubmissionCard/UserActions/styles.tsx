import styled from "styled-components";

export const History = styled.div`
  display: flex;;
  flex-direction: column;
  align-items: center;

  padding: 0 30px 15px;
`;

export const HistoryItem = styled.div`
  width: 100%;
  padding: 15px 15px;
  
  background-color: var(--white-1);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${({ color }) => color || "var(--primary-color)"};
  border-radius: 5px;

  & > div {
    display: flex;
    align-items: center;

    & > img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.05);
      object-fit: cover;

      margin-right: 10px;
    }

    & > p {
      margin: 0;
    }
  }

  & > p {
    & > span {
      font-weight: bold;
      font-style: normal;
    }

    width: 100%;
    margin: 10px 0 0;
    font-style: italic;
  }

  margin-bottom: 15px;
`;