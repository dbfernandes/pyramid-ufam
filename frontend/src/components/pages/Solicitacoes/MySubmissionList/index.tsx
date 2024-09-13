import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { getToken } from "utils";

// Shared
import Filter, { FilterCollapsible, IFilterOption, ActiveFilters, SearchBar } from "components/shared/Filter";
import { H3 } from "components/shared/Titles";
import Spinner from "components/shared/Spinner";
import Paginator from "components/shared/Paginator";
import { Disclaimer } from "components/shared/UserList/styles";
import SubmissionCard from "components/shared/cards/SubmissionCard";
import {
  ButtonGroupTop,
  DangerButtonAlt
} from "components/shared/cards/SubmissionCard/styles";

// Custom
import {
  Wrapper,
  HeaderWrapper,
  ListStyled
} from "../styles";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

interface ISubmissionListProps {
  submissions?: any[];
  loading?: boolean;
  totalPages: number;
  itensPerPage: number;
  totalItens: number;

  onChange?: Function;

  children?: React.ReactNode;
}

export default function MySubmissionList({
  submissions = [],
  loading,
  totalPages,
  itensPerPage,
  totalItens,

  onChange = () => { },

  children
}: ISubmissionListProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const userLogged = useSelector<IRootState, IUserLogged>(state => state.user);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  // Filter options
  const [fetchingFilter, setFetchingFilter] = useState<boolean>(false);
  const statuses = router.query.status?.toString().split("-");
  const [filterOptions, setFilterOptions] = useState<IFilterOption[]>([
    { title: "Pendentes", value: 1, checked: statuses?.includes("1") },
    { title: "Pré-aprovadas", value: 2, accent: "var(--success-hover)", checked: statuses?.includes("2") },
    { title: "Aprovadas", value: 3, accent: "var(--success)", checked: statuses?.includes("3") },
    { title: "Rejeitadas", value: 4, accent: "var(--danger)", checked: statuses?.includes("4") },
  ]);

  useEffect(() => {
    setFetchingFilter(true);
    const debounce = setTimeout(() => {
      const status = filterOptions.map(option => option.checked ? `${option.value}-` : "").join("").slice(0, -1);
      router.push({
        query: { ...router.query, status },
      });

      setFetchingFilter(false);
    }, 1000);

    return () => clearTimeout(debounce);
  }, [filterOptions]);

  // Mass actions
  const [fetchingMassCancel, setFetchingMassCancel] = useState<boolean>(false);
  async function fetchMassCancel(ids: string) {
    setFetchingMassCancel(true);

    const options = {
      url: `${process.env.api}/submissions/${ids}/mass-remove`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        const count = response.data.count;
        if (count === 0) {
          toast.info("Submissões já aprovadas não podem ser alteradas. Nenhuma submissão foi cancelada.");
        } else {
          toast.success(`${count} submissões canceladas com sucesso.`);
        }

        setCheckedIds([]);
        onChange();
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingMassCancel(false);
  }

  function MassActionsButtonGroup() {
    return (
      <ButtonGroupTop>
        <DangerButtonAlt onClick={() => fetchMassCancel(checkedIds.join(","))} disabled={fetchingMassCancel}>
          {fetchingMassCancel
            ? <Spinner size={"20px"} color={"var(--danger)"} />
            : <><i className="bi bi-x-lg" />Cancelar selecionadas</>
          }
        </DangerButtonAlt>
      </ButtonGroupTop>
    );
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <H3>Minhas submissões</H3>

        {!isMobile && (checkedIds?.length > 0 && <MassActionsButtonGroup />)}
      </HeaderWrapper>

      <Filter>
        <div className="filter-bar">
          <FilterCollapsible
            options={filterOptions}
            setOptions={setFilterOptions}
            fetching={fetchingFilter}
          />
          <SearchBar placeholder="Pesquisar submissões" />
        </div>

        <ActiveFilters
          options={filterOptions}
          setOptions={setFilterOptions}
          fetching={fetchingFilter}
        />
      </Filter>

      {isMobile && (checkedIds?.length > 0 && <MassActionsButtonGroup />)}

      {submissions?.length > 0
        ? <ListStyled>
          <SubmissionCard header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} userLogged={userLogged} />
          {submissions.map((submission) =>
            <SubmissionCard
              key={submission.id}
              submission={submission}
              loading={loading}
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              userLogged={userLogged}
              onChange={onChange}
            />
          )}

          {children}
        </ListStyled>
        : <Disclaimer>{totalItens === 0 ? "Você ainda não fez nenhuma submissão." : "Nenhuma submissão encontrada. Tente alterar a busca, filtro ou página."}</Disclaimer>
      }

      {totalItens > 0 &&
        <Paginator
          page={parseInt(router.query.page as string)}
          totalPages={totalPages}
          itensPerPage={itensPerPage}
          totalItens={totalItens}
        />
      }
    </Wrapper>
  )
}