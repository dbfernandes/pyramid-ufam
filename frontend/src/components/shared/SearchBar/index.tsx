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
  onChange: (searchTerm: string) => void;
}

export default function SearchBar({ placeholder = "Pesquisar...", onChange }: ISearchBarProps) {
  const router = useRouter();
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>(router.query.search ? router.query.search as string : "");
  const [searchBarFocused, setSearchBarFocused] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    // Atualiza o estado `search` com o valor do query string da rota, se houver
    setSearch(router.query.search ? router.query.search as string : "");
  }, [router.query.search]);

  // Função para focar no input de pesquisa quando o botão de pesquisa é clicado
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
          onChange={(e) => {
            // Atualiza o estado `search` quando o valor do input muda
            setSearch(e.target.value);
            // Chama a função de onChange passada como prop para transmitir o valor ao componente pai
            onChange(e.target.value);
          }}
          onBlur={() => setSearchBarFocused(false)} />

        {fetching
          ? <Spinner size={"16px"} color={"var(--text-default)"} />
          : <SearchButton onClick={focusSearch} unstyledBorder={searchBarFocused || search.length !== 0}>
              <i className="bi bi-search" />
            </SearchButton>
        }
      </ExpandingSearchWrapper>
    </Wrapper>
  );
}

