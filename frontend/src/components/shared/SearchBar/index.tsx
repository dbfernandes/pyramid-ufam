import { useState, useEffect, useRef } from "react";

// Shared
import Spinner from "components/shared/Spinner";

// Styles
import {
  Wrapper,
  ExpandingSearch,
  ExpandingSearchWrapper,
  SearchButton
} from "./styles";

// Interfaces
interface ISearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  search,
  setSearch,
  placeholder = "Pesquisar...",
}: ISearchBarProps) {
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const [_search, _setSearch] = useState<string>(search);
  const [searchBarFocused, setSearchBarFocused] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    setFetching(true);
    const debounce = setTimeout(() => {
      setSearch(_search);
      setFetching(false);
    }, 1000);

    return () => clearTimeout(debounce);
  }, [_search]);

  function focusSearch() {
    if (inputSearchRef.current) {
      inputSearchRef.current.focus();
      setSearchBarFocused(true);
    }
  }

  return (
    <Wrapper>
      <ExpandingSearchWrapper>
        <ExpandingSearch
          ref={inputSearchRef}
          type="text"
          value={_search}
          placeholder={placeholder}
          onChange={(e) => _setSearch(e.target.value)}
          onBlur={() => setSearchBarFocused(false)} />

        {fetching
          ? <Spinner size={"16px"} color={"var(--text-default)"} />
          : <SearchButton onClick={() => focusSearch()} unstyleBorder={searchBarFocused || _search.length != 0}>
            <i className="bi bi-search" />
          </SearchButton>
        }
      </ExpandingSearchWrapper>
    </Wrapper>
  );
}