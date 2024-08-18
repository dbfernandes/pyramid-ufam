import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

// Shared
import { H3 } from "components/shared/Titles";
import { ButtonGroup, DangerButtonAlt, InfoButton, WarningButtonAlt } from "components/shared/cards/SubmissionCard/styles";
import Paginator from "components/shared/Paginator";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import SearchBar from "components/shared/SearchBar";
import FilterCollapsible, { IFilterOption } from "../FilterCollapsible";
import Spinner from "../Spinner";

// Custom
import {
  HeaderWrapper,
  AddUserLink,
  ListStyled,
  Disclaimer,
  Filter
} from "./styles";
import User from "./User";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
interface IUserListProps {
  title: string;
  courseId?: number | null | undefined;
  users?: any[];
  loading?: boolean;
  totalPages: number;
  subRoute?: string;

  onChange?: Function;

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
  const loggedUser = useSelector<IRootState, IUserLogged>((state) => state.user);
  const router = useRouter();
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

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

  // Delete functions
  const [fetchingDelete, setFetchingDelete] = useState<boolean>(false);
  async function fetchDelete(id: string) {
    setFetchingDelete(true);

    const options = {
      url: `${process.env.api}/users/${id}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {

        toast.success("Usuário desativado com sucesso.");
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

    setFetchingDelete(false);
  }

  const [fetchingMassDelete, setFetchingMassDelete] = useState<boolean>(false);
  async function fetchMassDelete(ids: string) {
    setFetchingMassDelete(true);

    const options = {
      url: `${process.env.api}/users/${ids}/mass-remove`,
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
          toast.info("Nenhuma usuário foi desativado.");
        } else {
          toast.success(`${count} usuários desativados com sucesso.`);
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

    setFetchingMassDelete(false);
  }

  // Restore functions
  const [fetchingRestore, setFetchingRestore] = useState<boolean>(false);
  async function fetchRestore(id: string) {
    setFetchingRestore(true);

    const options = {
      url: `${process.env.api}/users/${id}/restore`,
      method: "PATCH",
      headers: {
        "Content-Type": "application",
        "Authorization": `Bearer ${getToken()}`,
      }
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {

        toast.success("Usuário reativado com sucesso.");
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

    setFetchingRestore(false);
  }

  const [fetchingMassRestore, setFetchingMassRestore] = useState<boolean>(false);
  async function fetchMassRestore(ids: string) {
    setFetchingMassRestore(true);

    const options = {
      url: `${process.env.api}/users/${ids}/mass-restore`,
      method: "PATCH",
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
          toast.info("Nenhuma usuário foi reativado.");
        } else {
          toast.success(`${count} usuários reativados com sucesso.`);
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

    setFetchingMassRestore(false);
  }

  return (
    <DefaultWrapper>
      <HeaderWrapper>
        <H3>{title}</H3>

        {checkedIds?.length > 0
          ? (<ButtonGroup style={{ margin: 0, width: "fit-content" }}>
            <DangerButtonAlt onClick={() => fetchMassDelete(checkedIds.join(","))} disabled={fetchingMassDelete}>
              {fetchingMassDelete
                ? <Spinner size={"20px"} color={"var(--danger)"} />
                : <><i className="bi bi-x-lg" /> Desativar selecionados</>
              }
            </DangerButtonAlt>

            <InfoButton onClick={() => fetchMassRestore(checkedIds.join(","))} disabled={fetchingMassRestore}>
              {fetchingMassRestore
                ? <Spinner size={"20px"} color={"var(--success)"} />
                : <><i className="bi bi-exclamation-lg" /> Reativar selecionados</>
              }
            </InfoButton>
          </ButtonGroup>) : (
            <Link href={`/usuarios/novo?tipo=${subRoutes[subRoute].singleTitle}`}>
              <AddUserLink>
                <i className={`bi bi-${subRoutes[subRoute].icon}`}>
                  <i className="bi bi-plus" />
                </i>
                Adicionar {subRoutes[subRoute].singleTitle}
              </AddUserLink>
            </Link>
          )}

      </HeaderWrapper>

      <Filter>
        <FilterCollapsible
          options={filterOptions}
          setOptions={setFilterOptions}
          fetching={fetchingFilter}
        />
        <SearchBar
          placeholder="Pesquisar usuários" />
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

              fetchingDelete={fetchingDelete}
              onDelete={() => fetchDelete(user?.id)}
              fetchingRestore={fetchingRestore}
              onRestore={() => fetchRestore(user?.id)}
              onChange={onChange}

              checkedIds={checkedIds}
              setCheckedIds={setCheckedIds}

              disableMenu={loggedUser?.id === user?.id}
            />
          )}
          {children}
        </ListStyled>)
        : (<Disclaimer>Nenhum {subRoutes[subRoute].singleTitle} encontrado.</Disclaimer>)
      }

      {users?.length > 0 && <Paginator page={parseInt(router.query.page as string)} totalPages={totalPages} />}
    </DefaultWrapper>
  );
}
