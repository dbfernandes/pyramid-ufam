import styled from "styled-components";

const size = 45;


export const Wrapper = styled.div`
  width: 50%;

  @media (max-width: 1200px) { width: 80%;}
  @media (max-width: 992px) { width: 65%; }
  @media (max-width: 768px) { width: 100%; }
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

   // Size + 2px border
  width: ${size + 2}px;
  height: ${size + 2}px;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: var(--text-default) !important;

  background: transparent;
  border: 1px solid transparent;
  border-radius: ${size / 2}px;

  transition: 0.3s;

  &:hover {
    border-color: ${({ unstyledBorder }) => unstyledBorder ? "transparent" : "rgba(0,0,0,0.2)"};
  }
`;

export const ExpandingSearch = styled.input`
  width: ${size}px;
  height: ${size}px;
  overflow: hidden;
  padding: 0;
  padding-left: ${size}px;

  border: 1px solid transparent;
  outline: none;
  border-radius: ${size / 2}px; // Needs to be the exact value as above, and not relative to element width
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

export const ClearButton = styled.button`
  position: absolute;
  right: 15px;
  background: none;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  align-items: center;
  font-size:  20px;
  cursor: pointer;
  color: var(--text-default);

  &:hover {
    color: var(--text-secondary);
  }
`;