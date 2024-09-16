import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";

// Shared
import { CustomFormCheck } from "components/shared/Table";
import Spinner from "components/shared/Spinner";

// Custom
import { IFilterOption } from "../useActiveFilters";
import {
  DropdownMenu,
  DropdownItem,
  FilterButton,
} from "./styles";

// Interfaces
interface IFilterCollapsibleProps {
  options: IFilterOption[];
  setOptions: React.Dispatch<React.SetStateAction<IFilterOption[]>>;
  fetching: boolean;
}

export function FilterCollapsible({
  options,
  setOptions,
  fetching
}: IFilterCollapsibleProps) {
  function handleDropdown(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleCheck(value: string | number, checked?: boolean) {
    const checkedLength = options.filter(option => option.checked === true)?.length;
    if (checkedLength === 1) {
      const checkedOption = options.find(option => option.checked === true);

      if (checkedOption && checkedOption.value === value) {
        return toast.info("Ao menos uma opção deve permanecer selecionada.");
      }
    }

    setOptions(options.map(option => {
      if (option.value === value) {
        return { ...option, checked: checked ? checked : !option.checked };
      }
      return option;
    }));
  }

  function DropdownItemComponent(option: IFilterOption) {
    return (
      <DropdownItem
        onClick={(e) => handleCheck(option.value)}
        accent={option.accent}
      >
        <CustomFormCheck
          type="checkbox"
          checked={option.checked}
          readOnly={true}
        /> {option.title}
      </DropdownItem>
    )
  }

  return (
    <Dropdown align="end" onClick={(e) => handleDropdown(e)} autoClose={"outside"}>
      <FilterButton variant="secondary">
        {fetching
          ? <Spinner size={"16px"} color={"var(--text-default)"} />
          : <i className="bi bi-sliders2" />
        }
      </FilterButton>

      <DropdownMenu renderOnMount={true}>
        {options.map((option, index) => (
          <DropdownItemComponent key={index} {...option} />
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export default FilterCollapsible;