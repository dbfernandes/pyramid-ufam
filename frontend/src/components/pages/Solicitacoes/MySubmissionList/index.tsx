import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

// Shared
import { H3 } from "components/shared/Titles";
import Paginator from "components/shared/Paginator";
import { Disclaimer, Filter } from "components/shared/UserList/styles";
import SubmissionCard from "components/shared/cards/SubmissionCard";
import {
  ButtonGroup,
  DangerButton
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
interface ISubmissionListProps {
  submissions?: any[];
  loading?: boolean;
  page: number;
  totalPages: number;
  search: string;
  setSearch: (search: string) => void;

  onDelete?: () => void;
  onUpdateStatus?: () => void;

  children?: React.ReactNode;
}

export default function MySubmissionList({
  submissions = [],
  loading,
  page,
  totalPages,
  search,
  setSearch,

  onDelete = () => { },
  onUpdateStatus = () => { },

  children
}: ISubmissionListProps) {
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  // Adicionar ações múltiplas aqui

  return (
    <Wrapper>
      <HeaderWrapper>
        <H3>Minhas solicitações</H3>

        {checkedIds?.length > 0 &&
          <ButtonGroup style={{ margin: 0, width: "fit-content" }}>
            <DangerButton onClick={() => { alert(`[ALUNO] ${checkedIds.toString()} DELETADOS`) }}>
              <i className="bi bi-x-lg" /> Cancelar selecionados
            </DangerButton>
          </ButtonGroup>
        }
      </HeaderWrapper>

      {submissions?.length > 0
        ? <>
          <Filter>
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar solicitações" />
          </Filter>

          <ListStyled>
            <SubmissionCard header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} user={user} />
            {submissions.map((submission) =>
              <SubmissionCard
                key={submission.id}
                submission={submission}
                loading={loading}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
                user={user}
                onDelete={onDelete}
                onUpdateStatus={onUpdateStatus}
              />
            )}
            {children}
          </ListStyled>
        </>
        : <Disclaimer>Você ainda não fez nenhuma solicitação.</Disclaimer>
      }

      {submissions?.length > 0 && <Paginator page={page} totalPages={totalPages} />}
    </Wrapper>
  )
}