import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import { getPlural, getToken } from "utils";

import { H3 } from "components/shared/Titles";
import Spinner from "components/shared/Spinner";
import { Disclaimer, Filter } from "components/shared/UserList/styles";
import SearchBar from "components/shared/SearchBar";
import FilterCollapsible, { IFilterOption } from "components/shared/FilterCollapsible";
import Paginator from "components/shared/Paginator";
import SubmissionCard from "components/shared/cards/SubmissionCard";
import {
  AcceptButton,
  DangerButtonAlt,
  ButtonGroupTop,
} from "components/shared/cards/SubmissionCard/styles";

import { Wrapper, HeaderWrapper, ListStyled } from "../styles";
import { toast } from "react-toastify";

import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
interface ISubmissionListProps {
  subTitle?: string;
  submissions?: any[];
  loading?: boolean;
  totalPages: number;
  onChange?: Function;
  children?: React.ReactNode;
}

export default function SubmissionList({
  subTitle,
  submissions = [],
  loading,
  totalPages,
  onChange = () => { },
  children,
}: ISubmissionListProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const [submissionCount, setSubmissionCount] = useState<number>(submissions.length)

  // Filter options
  const [fetchingFilter, setFetchingFilter] = useState<boolean>(false);
  const statuses = router.query.status?.toString().split("-");
  const [filterOptions, setFilterOptions] = useState<IFilterOption[]>([
    { title: "Pendentes", value: 1, accent: "var(--sucess-hover)", checked: statuses?.includes("1") },
    { title: "Pré-aprovadas", value: 2, accent: "var(--success-hover)", checked: statuses?.includes("2") },
    { title: "Aprovadas", value: 3, accent: "var(--success)", checked: statuses?.includes("3") },
    { title: "Rejeitadas", value: 4, accent: "var(--danger)", checked: statuses?.includes("4") },
  ]);

  useEffect(() => {
    setSubmissionCount(submissions.length)
  }, [submissions])

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
  const [fetchingMassUpdate, setFetchingMassUpdate] = useState<boolean>(false);
  async function fetchMassUpdate(ids: string, status: string) {
    setFetchingMassUpdate(true);

    const options = {
      url: `${process.env.api}/submissions/${ids}/status/mass-update`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      data: {
        status: status,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        const count = response.data.count;
        if (count === 0) {
          toast.info(`Submissões já aprovadas não podem ser alteradas. Nenhuma submissão foi ${status.toLowerCase().substring(0, status.length - 1).concat("a")}.`);
        } else {
          toast.success(`${count} submissões ${getPlural(status)} com sucesso.`);
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

    setFetchingMassUpdate(false);
  }

  function MassActionsButtonGroup() {
    return (
      <ButtonGroupTop>
        {user.userTypeId == 1 && <>
          <DangerButtonAlt onClick={() => fetchMassUpdate(checkedIds.join(","), "Rejeitado")} disabled={fetchingMassUpdate}>
            {fetchingMassUpdate
              ? <Spinner size={"20px"} color={"var(--danger)"} />
              : <><i className="bi bi-x-lg" /> Rejeitar selecionadas</>
            }
          </DangerButtonAlt>
          <AcceptButton onClick={() => fetchMassUpdate(checkedIds.join(","), "Aprovado")} disabled={fetchingMassUpdate}>
            {fetchingMassUpdate
              ? <Spinner size={"20px"} color={"var(--danger)"} />
              : <><i className="bi bi-check2-all" /> Aprovar selecionadas</>
            }
          </AcceptButton>
        </>}

        {user.userTypeId == 2 && <AcceptButton onClick={() => fetchMassUpdate(checkedIds.join(","), "Pré-aprovado")} disabled={fetchingMassUpdate}>
          {fetchingMassUpdate
            ? <Spinner size={"20px"} color={"var(--danger)"} />
            : <><i className="bi bi-check2-all" /> Pré-aprovar selecionadas</>
          }
        </AcceptButton>}
      </ButtonGroupTop>
    );
  }

  return (
    <Wrapper>
      <HeaderWrapper>
        <H3>Submissões {subTitle && `(${subTitle})`}</H3>

        {!isMobile && (checkedIds.length > 0 && <MassActionsButtonGroup />)}
      </HeaderWrapper>

      <Filter>
        <FilterCollapsible options={filterOptions} setOptions={setFilterOptions} fetching={fetchingFilter} />
        <SearchBar placeholder="Pesquisar por nome, atividade, horas solicitadas e descrição" />
      </Filter>

      {isMobile && (checkedIds.length > 0 && <MassActionsButtonGroup />)}

      {submissionCount > 0 ? (
        <ListStyled>
          <SubmissionCard header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} />
          {submissions.map((submission, index) => (
            <SubmissionCard
              key={index}
              submission={submission}
              loading={loading}
              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}
              user={user}
              onChange={onChange}
            />
          ))}
          {children}
        </ListStyled>
      ) : (
        <Disclaimer>Nenhuma submissão nessa categoria foi encontrada. Tente alterar o filtro.</Disclaimer>
      )}

      <p className="submissionsCount">Total de submissões: {submissionCount}</p>

      {submissions.length > 0 && <Paginator page={parseInt(router.query.page as string)} totalPages={totalPages} />}
    </Wrapper>
  );
}
