import { useState } from "react";
import { useSelector } from "react-redux";

// Shared
import { H3 } from "components/shared/Titles";
import Paginator from "components/shared/Paginator";
import SubmissionCard from "components/shared/cards/SubmissionCard";
import {
  ButtonGroup,
  AcceptButton,
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
import { Disclaimer, Filter } from "components/shared/UserList/styles";
import SearchBar from "components/shared/SearchBar";
interface ISubmissionListProps {
  subTitle?: string;

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

export default function SubmissionList({
  subTitle,
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
        <H3>Solicitações {subTitle && `(${subTitle})`}</H3>

        {checkedIds?.length > 0 &&
          (user.userTypeId == 1
            ? <ButtonGroup style={{ margin: 0, width: "fit-content" }}>
              <DangerButton onClick={() => { alert(`[COORDENADOR] ${checkedIds.toString()} REJEITADOS`) }}>
                <i className="bi bi-x-lg" /> Rejeitar selecionados
              </DangerButton>

              <AcceptButton onClick={() => { alert(`[COORDENADOR] ${checkedIds.toString()} APROVADOS`) }}>
                <i className="bi bi-check2-all" /> Aprovar selecionados
              </AcceptButton>
            </ButtonGroup>
            : user.userTypeId == 2 && <ButtonGroup style={{ margin: 0, width: "fit-content" }}>
              <AcceptButton onClick={() => { alert(`[SECRETÁRIO] ${checkedIds.toString()} PRÉ-APROVADOS`) }}>
                <i className="bi bi-check2-all" /> Pré-aprovar selecionados
              </AcceptButton>
            </ButtonGroup>
          )
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
            <SubmissionCard header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} />
            {submissions?.length > 0 && submissions.map((submission, index) =>
              <SubmissionCard
                key={index}
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
        : <Disclaimer>Não há solicitações cadastradas.</Disclaimer>
      }

      {submissions?.length > 0 && <Paginator page={page} totalPages={totalPages} />}
    </Wrapper>
  )
}