import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpandingSearchWrapper = styled.div`
  position: relative;
  color: var(--text-default) !important;

  & > .spinner {
    position: absolute;
    top: 12px;
    left: 12px;
  }
`;

export const SearchButton = styled.button<{ unstyledBorder: boolean }>`
  position: absolute;
  top: 0;
  left: 0;

  width: 41px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: var(--text-default) !important;

  background: transparent;
  border: 1px solid transparent;
  border-radius: 20px;

  transition: 0.3s;

  &:hover {
    border-color: ${({ unstyledBorder }) => unstyledBorder ? "transparent" : "rgba(0,0,0,0.2)"};
  }
`;

export const ExpandingSearch = styled.input`
  width: 40px;
  height: 40px;
  overflow: hidden;
  padding: 0;
  padding-left: 40px;

  border: 1px solid transparent;
  outline: none;
  border-radius: 20px;
  background-color: var(--white-2);
  font-style: italic;
  color: var(--text-default) !important;
  
  transition: 0.3s;
  
  &:focus {
    width: 100%;
    border-color: rgba(0,0,0,0.2);
  }

  &:hover {
    border-color: rgba(0,0,0,0.2);
  }

  &:not(:placeholder-shown) {
    width: 100%;
  }
`;