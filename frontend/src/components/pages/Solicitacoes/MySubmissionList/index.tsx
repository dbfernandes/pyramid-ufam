import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { getToken } from "utils";

// Shared
import { H3 } from "components/shared/Titles";
import Paginator from "components/shared/Paginator";
import { Disclaimer, Filter } from "components/shared/UserList/styles";
import SubmissionCard from "components/shared/cards/SubmissionCard";
import {
  ButtonGroup,
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
import SearchBar from "components/shared/SearchBar";
import FilterCollapsible, { IFilterOption } from "components/shared/FilterCollapsible";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import Spinner from "components/shared/Spinner";
interface ISubmissionListProps {
  submissions?: any[];
  loading?: boolean;
  totalPages: number;

  onChange?: Function;

  children?: React.ReactNode;
}

export default function MySubmissionList({
  submissions = [],
  loading,
  totalPages,

  onChange = () => { },

  children
}: ISubmissionListProps) {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
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
        "Content-Type": "application",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        toast.success("Submissões canceladas com sucesso.");
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

  return (
    <Wrapper>
      <HeaderWrapper>
        <H3>Minhas submissões</H3>

        {checkedIds?.length > 0 &&
          <ButtonGroup style={{ margin: 0, width: "fit-content" }}>
            <DangerButtonAlt onClick={() => fetchMassCancel(checkedIds.join(","))} disabled={fetchingMassCancel}>
              {fetchingMassCancel
                ? <Spinner size={"20px"} color={"var(--danger)"} />
                : <><i className="bi bi-x-lg" /> Cancelar selecionados</>
              }
            </DangerButtonAlt>
          </ButtonGroup>
        }
      </HeaderWrapper>

      <Filter>
        <FilterCollapsible
          options={filterOptions}
          setOptions={setFilterOptions}
          fetching={fetchingFilter}
        />
        <SearchBar
          placeholder="Pesquisar submissões" />
      </Filter>

      {submissions?.length > 0
        ? <ListStyled>
          <SubmissionCard header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} user={user} />
          {submissions.map((submission) =>
            <SubmissionCard
              key={submission.id}
              submission={submission}
              loading={loading}
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              user={user}
              onChange={onChange}
            />
          )}

          {children}
        </ListStyled>
        : <Disclaimer>Você ainda não fez nenhuma submissão.</Disclaimer>
      }

      {submissions?.length > 0 && <Paginator page={parseInt(router.query.page as string)} totalPages={totalPages} />}
    </Wrapper>
  )
}