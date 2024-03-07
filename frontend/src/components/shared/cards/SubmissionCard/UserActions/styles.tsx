import styled from "styled-components";

export const History = styled.div`
  display: flex;;
  flex-direction: column;
  align-items: center;

  padding: 0 30px 15px;
`;

export const HistoryItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px 15px;
  
  background-color: var(--white-1);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${({ color }) => color || "var(--primary-color)"};
  border-radius: 5px;

  img {
    width: 30px;
    height: 30px;
    object-fit: cover;

    margin-right: 10px;
  }

  p {
    margin: 0;
  }

  margin-bottom: 15px;
`;