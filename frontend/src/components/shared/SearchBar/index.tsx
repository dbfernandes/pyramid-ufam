import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

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
  placeholder?: string;
}

export default function SearchBar({
  placeholder = "Pesquisar...",
}: ISearchBarProps) {
  const router = useRouter();
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>(router.query.search ? router.query.search as string : "");
  const [searchBarFocused, setSearchBarFocused] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    setFetching(true);
    const debounce = setTimeout(() => {
      router.push({
        query: { ...router.query, search, page: 1 },
      });
      setFetching(false);
    }, 1000);

    return () => clearTimeout(debounce);
  }, [search]);

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
          value={search}
          placeholder={placeholder}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => setSearchBarFocused(false)} />

        {fetching
          ? <Spinner size={"16px"} color={"var(--text-default)"} />
          : <SearchButton onClick={() => focusSearch()} unstyledBorder={searchBarFocused || search.length != 0}>
            <i className="bi bi-search" />
          </SearchButton>
        }
      </ExpandingSearchWrapper>
    </Wrapper>
  );
}