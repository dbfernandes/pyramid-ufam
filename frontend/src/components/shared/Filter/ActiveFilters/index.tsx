import useActiveFilters, { IFilterOption } from "../useActiveFilters";

// Custom
import {
  ActiveFiltersContainer,
  ActiveFilter,
  RemoveFilterButton,
} from "./styles";
import { toast } from "react-toastify";

// Interfaces
interface IActiveFiltersProps {
  options: IFilterOption[];
  setOptions: React.Dispatch<React.SetStateAction<IFilterOption[]>>;
  fetching: boolean;
}

export function ActiveFilters({
  options,
  setOptions,
  fetching
}: IActiveFiltersProps) {
  const activeFilters = useActiveFilters(options);

  function handleCheck(value: string | number, checked?: boolean) {
    const checkedLength = options.filter(option => option.checked === true)?.length;
    if (checkedLength === 1) {
      const checkedOption = options.find(option => option.checked === true);

      if (checkedOption && checkedOption.value === value) {
        return toast.info("Ao menos uma opção deve permanecer selecionada.");;
      }
    }

    setOptions(options.map(option => {
      if (option.value === value) {
        return { ...option, checked: checked ? checked : !option.checked };
      }
      return option;
    }));
  }

  return (
    activeFilters.length > 0 ? (
      <ActiveFiltersContainer>
        {activeFilters.map((filter) => (
          <ActiveFilter key={filter.value} className={filter.title === "Pré-aprovadas" ? "pre-aprovadas" : ""}>
            <span>{filter.title}</span>
            <RemoveFilterButton onClick={() => handleCheck(filter.value, false)}>
              <i className="bi bi-x-lg" />
            </RemoveFilterButton>
          </ActiveFilter>
        ))}
      </ActiveFiltersContainer>
    ) : null
  );
}

export default ActiveFilters;