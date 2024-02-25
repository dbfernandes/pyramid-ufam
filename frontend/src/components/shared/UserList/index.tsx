import { useState } from "react";
import Link from "next/link";

// Shared
import { H3 } from "components/shared/Titles";
import { DangerButton } from "components/shared/cards/SubmissionCard/styles";
import Paginator from "components/shared/Paginator";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import SearchBar from "components/shared/SearchBar";

// Custom
import {
  HeaderWrapper,
  AddUserLink,
  ListStyled,
  Disclaimer,
  Filter
} from "./styles";
import User from "./User";

// Interface
interface IUserListProps {
  title: string;
  courseId?: number | null | undefined;
  users?: any[];
  loading?: boolean;
  page: number;
  totalPages: number;
  subRoute?: string;
  search: string;
  setSearch: (search: string) => void;
  children?: React.ReactNode;
}

export default function UserList({ title, users = [], loading, page, totalPages, subRoute = "", courseId, search, setSearch, children }: IUserListProps) {
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  // Adicionar ações múltiplas aqui

  const subRoutes = {
    "alunos": {
      icon: "people",
      singleTitle: "aluno"
    },
    "coordenadores": {
      icon: "person-workspace",
      singleTitle: "coordenador"
    },
    "secretarios": {
      icon: "person-badge",
      singleTitle: "secretário"
    },
  }

  return (
    <DefaultWrapper>
      <HeaderWrapper>
        <H3>{title}</H3>

        {checkedIds?.length > 0
          ? <DangerButton onClick={() => { alert(`[COORDENADOR] ${checkedIds.toString()} DESATIVADOS`) }}>
            <i className="bi bi-x-lg" /> Desativar selecionados
          </DangerButton>
          : <Link href={`/usuarios/novo?tipo=${subRoutes[subRoute].singleTitle}`}>
            <AddUserLink>
              <i className={`bi bi-${subRoutes[subRoute].icon}`}>
                <i className="bi bi-plus" />
              </i>
              Adicionar {subRoutes[subRoute].singleTitle}
            </AddUserLink>
          </Link>
        }
      </HeaderWrapper>

      {users?.length > 0 ?
        (<>
          <Filter>
            <SearchBar
              search={search}
              setSearch={setSearch}
              placeholder="Pesquisar alunos" />
          </Filter>
          <ListStyled>
            <User header={true} checkedIds={checkedIds} setCheckedIds={setCheckedIds} subRoute={subRoute} />
            {users.map((user, index) =>
              <User
                key={index}
                user={user}
                courseId={courseId}
                subRoute={subRoute}
                loading={loading}
                checkedIds={checkedIds}
                setCheckedIds={setCheckedIds}
              />
            )}
            {children}
          </ListStyled>
        </>)
        : (<Disclaimer>Não há {subRoute} cadastrados.</Disclaimer>)
      }

      {users?.length > 0 && <Paginator page={page} totalPages={totalPages} />}
    </DefaultWrapper>
  );
}