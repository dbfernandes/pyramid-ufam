import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

// Shared
import { H3 } from "components/shared/Titles";
import { DangerButtonAlt } from "components/shared/cards/SubmissionCard/styles";
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
import FilterCollapsible, { IFilterOption } from "../FilterCollapsible";

// Interface
interface IUserListProps {
  title: string;
  courseId?: number | null | undefined;
  users?: any[];
  loading?: boolean;
  totalPages: number;
  subRoute?: string;

  onChange?: () => void;

  children?: React.ReactNode;
}

export default function UserList({
  title,
  users = [],
  loading,
  totalPages,
  subRoute = "",
  courseId,

  onChange = () => { },

  children
}: IUserListProps) {
  const router = useRouter();
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  // Filter options
  const [fetchingFilter, setFetchingFilter] = useState<boolean>(false);
  const statuses = router.query.status?.toString().split("-");
  const [filterOptions, setFilterOptions] = useState<IFilterOption[]>([
    { title: "Ativos", value: 1, accent: "var(--success)", checked: statuses?.includes("1") },
    { title: "Inativos", value: 0, accent: "var(--danger)", checked: statuses?.includes("0") },
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
          ? <DangerButtonAlt onClick={() => { alert(`[COORDENADOR] ${checkedIds.toString()} DESATIVADOS`) }}>
            <i className="bi bi-x-lg" /> Desativar selecionados
          </DangerButtonAlt>
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

      <Filter>
        <FilterCollapsible
          options={filterOptions}
          setOptions={setFilterOptions}
          fetching={fetchingFilter}
        />
        <SearchBar
          placeholder="Pesquisar alunos" />
      </Filter>

      {users?.length > 0 ?
        (<ListStyled>
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
        </ListStyled>)
        : (<Disclaimer>Não há {subRoute} cadastrados.</Disclaimer>)
      }

      {users?.length > 0 && <Paginator page={parseInt(router.query.page as string)} totalPages={totalPages} />}
    </DefaultWrapper>
  );
}