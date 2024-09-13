
import { range } from "utils";
import { useRouter } from "next/router";

// Custom
import {
  Wrapper,
  PaginatorWrapper,
  PageItem,
  PageArrowButton,
  ItensCountLabel
} from "./styles";

// Interfaces
interface IPaginatorProps {
  page: number;
  totalPages: number;
  itensPerPage: number;
  totalItens: number;
}

export default function Paginator({ page, totalPages, itensPerPage, totalItens }: IPaginatorProps) {
  const maxPages = 3; // Needs to be odd

  function genereatePages(page, totalPages) {
    if (totalPages > maxPages) {
      const start = [1, 2, 3]; // First 3 pages
      const end = range(totalPages - 2, totalPages); // Last 3 pages

      const half = Math.floor(maxPages / 2);

      // Grouping the page
      if (start.includes(page)) return range(1, maxPages); // Check if the page is in the first 3 pages
      if (end.includes(page as never)) return range(totalPages - 4, totalPages); // Check if the page is in the last 3 pages
      return range(page - half, page + half); // Check if the page is in the middle
    }
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const router = useRouter();
  function setPage(page) {
    router.push({
      query: { ...router.query, page },
    });
  }

  function ItensCount() {
    const isFinalPage = page === totalPages;
    const endItem = isFinalPage ? totalItens % itensPerPage : page * itensPerPage;
    const startItem = (endItem + 1) - (isFinalPage ? endItem : itensPerPage);

    return (
      <ItensCountLabel>
        Exibindo <b>{startItem}-{endItem}</b> do total de <b>{totalItens}</b>
      </ItensCountLabel>
    );
  }

  return (
    <Wrapper>
      <ItensCount />
      <PaginatorWrapper>
        <PageArrowButton disabled={page == 1} onClick={() => setPage(1)}><i className="bi bi-chevron-double-left" /></PageArrowButton>
        <PageArrowButton disabled={page == 1} onClick={() => setPage(page - 1)}><i className="bi bi-chevron-left" /></PageArrowButton>

        {genereatePages(page, totalPages).map((_page) =>
          <PageItem key={_page} marked={_page == page} disabled={_page == page} onClick={() => setPage(_page)}>{_page}</PageItem>
        )}

        <PageArrowButton disabled={page == totalPages} onClick={() => setPage(page + 1)}><i className="bi bi-chevron-right" /></PageArrowButton>
        <PageArrowButton disabled={page == totalPages} onClick={() => setPage(totalPages)}><i className="bi bi-chevron-double-right" /></PageArrowButton>
      </PaginatorWrapper>
    </Wrapper>
  )
}