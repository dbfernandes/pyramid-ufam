import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import { CustomFormCheck } from "components/shared/Table";

const size = 40;

export const DropdownMenu = styled(Dropdown.Menu)`
  z-index: 10;
  padding: 10px 0;
  background-color: var(--white-1);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

export const DropdownItem = styled(Dropdown.Item) <{ accent?: string }>`
  display: flex;
  align-items: center;
  padding: 7.5px 15px;
  font-size: 0.75rem;
  color: var(--text-default) !important;
  border-left: 3px solid transparent;
  transition: 0.3s;

  & > ${CustomFormCheck} {
    padding: 0;
    margin-right: 10px;
    cursor: pointer;
  }

  &:hover {
    background-color: var(--white-2);
    border-color: ${({ accent }) => accent ? accent : "var(--primary-color)"};

    i {
      color: ${({ accent }) => accent ? accent : "var(--primary-color)"};
    }
  }
`;

export const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterButton = styled.button<{ active: boolean; accent: string }>`
  flex: 1;
  max-width: 150px;
  border: 1px solid ${({ active, accent }) =>  "var(--primary-color)"};
  border-radius: 25px;
  background-color: ${({ active, accent }) => (active ? "var(--primary-color)" : "transparent")};
  color: ${({ active }) => (active ? "var(--white-1)" : "var(--default-text)")};
  border: 1px solid ${({ active }) => (active ? "trasnparent" : "var(--primary-color)")};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  align-items: center;
  transition: all 0.3s;
  height: 37px;

  &:hover {
    background-color: ${({ accent }) => "var(--primary-color)"};
		background: var(--primary-color-2-background);

    color: var(--primary-color-2);
  }
`;