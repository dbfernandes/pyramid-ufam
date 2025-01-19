import { toast } from "react-toastify";
import styled from "styled-components";
import Spinner from "components/shared/Spinner";

// Interfaces
import { IFilterOption } from "../useActiveFilters";
import { FilterButton, FiltersContainer } from "./styles";


interface IFilterCollapsibleProps {
  options: IFilterOption[];
  setOptions: React.Dispatch<React.SetStateAction<IFilterOption[]>>;
  fetching: boolean;
}

export function FilterCollapsible({
  options,
  setOptions,
  fetching,
}: IFilterCollapsibleProps) {
  function handleToggle(value: string | number) {
    const checkedLength = options.filter((option) => option.checked)?.length;
    if (checkedLength === 1) {
      const checkedOption = options.find((option) => option.checked);
      if (checkedOption && checkedOption.value === value) {
        return toast.info("Ao menos uma opção deve permanecer selecionada.");
      }
    }

    setOptions(
      options.map((option) =>
        option.value === value
          ? { ...option, checked: !option.checked }
          : option
      )
    );
  }

  return (
    <FiltersContainer>
      { options.map((option, index) => (
          <FilterButton
            key={index}
            onClick={() => handleToggle(option.value)}
            active={option.checked}
            accent={option.accent}
          >
            {option.title}
          </FilterButton>
        ))
      }
    </FiltersContainer>
  );
}

export default FilterCollapsible;
