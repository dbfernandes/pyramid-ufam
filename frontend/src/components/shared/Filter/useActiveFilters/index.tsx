import { useState, useEffect } from 'react';

export interface IFilterOption {
  title: string;
  value: string | number;
  checked?: boolean;
  accent?: string;
}

function useActiveFilters(options: IFilterOption[]) {
  const [activeFilters, setActiveFilters] = useState<IFilterOption[]>([]);

  useEffect(() => {
    const activeOptions = options.filter(option => option.checked);
    setActiveFilters(activeOptions);
  }, [options]);

  return activeFilters;
}

export default useActiveFilters;