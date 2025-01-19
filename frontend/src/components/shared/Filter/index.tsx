import styled from "styled-components";

const Filter = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 15px;
  margin-top: 20px;

  & > div.filter-bar {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 4fr));
    gap: 30px;
  }
`;

export default Filter;

export * from "./useActiveFilters";
export * from "./ActiveFilters";
export * from "./FilterCollapsible";
export * from "./SearchBar";
