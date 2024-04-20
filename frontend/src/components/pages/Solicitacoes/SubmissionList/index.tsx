import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";

import { H3 } from "components/shared/Titles";
import { Disclaimer, Filter } from "components/shared/UserList/styles";
import SearchBar from "components/shared/SearchBar";
import FilterCollapsible, { IFilterOption } from "components/shared/FilterCollapsible";
import Paginator from "components/shared/Paginator";
import SubmissionCard from "components/shared/cards/SubmissionCard";
import {
  ButtonGroup,
  AcceptButton,
  DangerButtonAlt,
} from "components/shared/cards/SubmissionCard/styles";

import { Wrapper, HeaderWrapper, ListStyled } from "../styles";
import toast from "components/shared/Toast";

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

// Move a exportação da função countPendingSubmissions para fora do componente
export const countPendingSubmissions = (submissions) => {
  return submissions.filter((submission) => submission.status === 1).length;
};

export default function SubmissionList({
  subTitle,
  submissions = [],
  loading,
  totalPages,
  onChange = () => {},
  children,
}: ISubmissionListProps) {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  // Filter options
  const [fetchingFilter, setFetchingFilter] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<IFilterOption[]>([
    { title: "Pendentes", value: 1, checked: false },
    { title: "Pré-aprovadas", value: 2, accent: "var(--success-hover)", checked: false },
    { title: "Aprovadas", value: 3, accent: "var(--success)", checked: false },
    { title: "Rejeitadas", value: 4, accent: "var(--danger)", checked: false },
  ]);

  async function handleStatusUpdate(status: string) {
    if (checkedIds.length === 0) {
      toast("Aviso", "Selecione pelo menos uma solicitação para alterar o status.");
      return;
    }

    setFetching(true);

    const promises = checkedIds.map(async (id) => {
      const currentStatus = submissions.find((submission) => submission.id === id)?.status;

      if (currentStatus && currentStatus !== status) {
        const options = {
          url: `${process.env.api}/submissions/${id}/status`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            userId: user.id,
            status: status,
          },
        } as AxiosRequestConfig;
        await axios.request(options);
      }
    });

    try {
      await Promise.all(promises);
      toast("Sucesso", `Status atualizado para ${status} com sucesso.`, "success");
      setFetching(false);
      onChange();
    } catch (error) {
      const errorMessages = {
        0: "Oops, tivemos um erro. Tente novamente.",
        500: "Erro interno do servidor.",
      };
      const code = 0;
      toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
      setFetching(false);
    }
  }

  /*
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  console.log(countPendingSubmissions(submissions));
  
  const filteredSubmissions = submissions.filter((submission) => {
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      if (
        submission &&
        submission.user &&
        submission.activity.activityGroup.name &&
        submission.workload &&
        submission.activity.description
      ) {
        const nameLower = submission.user.name.toLowerCase();
        const activityNameLower = submission.activity.name.toLowerCase();
        const activityGroupNameLower = submission.activity.activityGroup.name.toLowerCase();
        const activityGroupHour = submission.workload;
        const descriptionLower = submission.activity.description.toLowerCase();

        return (
          nameLower.includes(searchTermLower) ||
          activityNameLower.includes(searchTermLower) ||
          activityGroupNameLower.includes(searchTermLower) ||
          (typeof activityGroupHour === "string" && activityGroupHour.includes(searchTermLower)) ||
          (typeof activityGroupHour === "number" && activityGroupHour.toString().includes(searchTermLower)) ||
          descriptionLower.includes(searchTermLower)
        );
      } else {
        return false;
      }
    }

    return true;
  }); 
  */

  return (
    <Wrapper>
      <HeaderWrapper>
        <H3>Solicitações {subTitle && `(${subTitle})`}</H3>

        {checkedIds.length > 0 && (
          <ButtonGroup style={{ margin: 0, width: "fit-content" }}>
            <DangerButtonAlt onClick={() => handleStatusUpdate("Rejeitado")}>
              <i className="bi bi-x-lg" /> Rejeitar selecionados
            </DangerButtonAlt>
            <AcceptButton onClick={() => handleStatusUpdate("Pré-aprovado")}>
              <i className="bi bi-check2-all" /> Pré-aprovar selecionados
            </AcceptButton>
            <AcceptButton onClick={() => handleStatusUpdate("Aprovado")}>
              <i className="bi bi-check2-all" /> Aprovar selecionados
            </AcceptButton>
          </ButtonGroup>
        )}
      </HeaderWrapper>

      <Filter>
        <FilterCollapsible options={filterOptions} setOptions={setFilterOptions} fetching={fetchingFilter} />
        <SearchBar placeholder="Pesquisar por nome, atividade, horas solicitadas e descrição" />
      </Filter>

      {submissions?.length > 0
        ? <ListStyled>
          <SubmissionCard header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} />
          {submissions?.length > 0 && submissions.map((submission, index) =>
            <SubmissionCard
              key={index}
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
        : <Disclaimer>Não há solicitações nesta categoria. Tente alterar o filtro.</Disclaimer>
      }

      {submissions.length > 0 && <Paginator page={parseInt(router.query.page as string)} totalPages={totalPages} />}
    </Wrapper>
  );
}
