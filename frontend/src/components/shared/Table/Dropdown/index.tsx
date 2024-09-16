import styled from 'styled-components';
import { Dropdown } from "react-bootstrap";

// Custom dropdown
export const DropdownMenu = styled(Dropdown.Menu)`
  z-index: 10;

  padding: 10px 0;

  background-color: var(--white-1);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;

export const DropdownItem = styled(Dropdown.Item) <{ accent?: string }>`
  padding: 7.5px 15px;

  font-size: 0.875rem;
  color: var(--text-default) !important;
  border-left: 3px solid transparent;

  transition: 0.3s;

  i {
    vertical-align: top;
    margin-right: 5px;
  }

  &:hover {
    background-color: var(--white-2);
    border-color: ${({ accent }) => accent ? accent : "var(--primary-color)"};

    i {
      color: ${({ accent }) => accent ? accent : "var(--primary-color)"};
    }
  }
`;

export const Options = styled(Dropdown.Toggle)`
  height: 2.5rem;
  width: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0;

  font-size: 1.75rem;
  background-color: transparent !important;
  color: var(--muted);
  border: none !important;
  outline: none !important;

  transition: 0.3s;

  &:hover, &:focus {
    color: var(--primary-color-2);
    box-shadow: none !important;
  }
  &:focus, &[aria-expanded=true] {
    color: var(--primary-color) !important;
  }
  &:after {
    display: none;
  }
`;