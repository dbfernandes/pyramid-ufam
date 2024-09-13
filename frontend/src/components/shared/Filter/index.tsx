import styled from 'styled-components';

const Filter = styled.div`
  width: 100%;
  /*display: flex;
  align-items: center;*/
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 15px;
  margin-top: 15px;

  & > div.filter-bar {
    width: 100%;
    display: grid;
    grid-template-columns: 62px 1fr;
    grid-gap: 15px;
  }
`;

export default Filter;

export * from './useActiveFilters';
export * from './ActiveFilters';
export * from './FilterCollapsible';
export * from './SearchBar';