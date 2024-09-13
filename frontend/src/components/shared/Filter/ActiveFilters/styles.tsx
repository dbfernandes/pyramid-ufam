import styled from 'styled-components';

export const ActiveFiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ActiveFilter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: var(--white-2);
  padding: 5px 10px;
  padding-right: 5px;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 0.75rem;

  & > span {
    border-right: 1px solid var(--white-5);
    padding-right: 5px;
    margin-right: 5px;
  } 
`;

export const RemoveFilterButton = styled.button`
  background: none;
  border: none;

  padding: 2px 4px;
  color: var(--danger);
  cursor: pointer;
  font-size: 0.75rem;

  border-radius: 5px;

  transition: 0.3s;

  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
`;
