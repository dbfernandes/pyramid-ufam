import styled from "styled-components";
import { Dropdown } from "react-bootstrap";
import { CustomFormCheck } from "../cards/SubmissionCard/styles";

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

  font-size: 0.75rem; /* Diminua a fonte aqui */
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


export const FilterButton = styled(Dropdown.Toggle)`
  height: 41px;
	display: flex;
	justify-content: center;
	align-items: center;

	padding: 0 15px;

  font-size: 1.125rem;
	background-color: var(--white-2);
	color: var(--text-default) !important;
	border: 1px solid transparent;
	outline: none !important;

	transition: 0.3s;

	&:hover, &:focus, &.active, &.show {
    box-shadow: none !important;
    background-color: var(--white-2);
    border-color: rgba(0,0,0,0.2);

    &:first-child {
      background-color: var(--white-2);
      border-color: rgba(0,0,0,0.2);
    }
	}
  &:focus, &[aria-expanded=true] {
    animation: none;
  }

  & > .spinner {
    margin-right: 2px;
  }

  @media (max-width: 575px) {
		& > .spinner {
      margin-right: 0;
    }
	}
`;

export const FilterLabel = styled.span`
	margin-left: 8px;
	font-size: 14px;
	color: var(--text-default);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`

export const ActiveFiltersContainer = styled.div`
  	display: flex;
  	gap: 8px;
  	align-items: center;
  	height: 41px;
	margin-bottom: 4px;
	overflow: auto;
	width: 100%;
`;
  
export const ActiveFilter = styled.div`
  	display: flex;
  	align-items: center;
  	background-color: var(--white-2);
  	padding: 5px 10px;
  	border-radius: 4px;
  	height: 100%;

	@media (max-width: 768)
`;

export const RemoveFilterButton = styled.button`
  	background: none;
  	border: none;
  	color: var(--hidden);
  	margin-left: 5px;
  	cursor: pointer;
  	font-size: 1rem;
`;
