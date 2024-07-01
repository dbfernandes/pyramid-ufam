import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";
import { parseUserActiveParam } from "utils";
import { toast } from "react-toastify";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import UserList from "components/shared/UserList";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import { useMediaQuery } from "react-responsive";

interface IAlunoProps {
  onChange?: Function;
}

export default function Alunos({ onChange = () => { } }: IAlunoProps) {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();
  const isMobile = useMediaQuery({ maxWidth: 992 });
  const [isReloading, setIsReloading] = useState(false);

  async function handleReload() {
    setIsReloading(true);

    try {
      const response = await axios.get(`${process.env.api}/usuarios/alunos`);
      onChange(response.data);
      setIsReloading(false);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
      setIsReloading(false);
    }
  }

  // Setting links used in breadcrumb
  useEffect(() => {
    const url = router.asPath;
    if (!url.includes("page") || !url.includes("search") || !url.includes("status")) {
      router.replace(`${url.split("?")[0]}?page=1&search=&status=1`);
    }

    setLinks([
      { title: "Usuário" },
      { title: "Alunos" },
    ]);
  }, []);

  // Verifying user
  useEffect(() => {
    if (!user.logged) {
      router.replace("/entrar");
    } else if (user.selectedCourse == null) {
      router.replace("/conta/curso");
    } else {
      setTimeout(() => setLoaded(true), 250);
    }
  }, [user]);

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(true);

  // Fetching users
  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string) : 1);
  const [search, setSearch] = useState<string>(router.query.search ? router.query.search as string : "");
  const [status, setStatus] = useState<string>(router.query.status ? router.query.status as string : "1");

  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const _page = parseInt(router.query.page as string);
    const _search = router.query.search as string;
    const _status = router.query.status as string;

    if (_page !== undefined && _status !== undefined && _search !== undefined) {
      setPage(_page);
      setSearch(_search);
      setStatus(_status);

      fetchUsers(_page, _search, _status);
    }
  }, [router]);

  async function fetchUsers(_page, _search, _status) {
    setFetchingUsers(true);

    const options = {
      url: `${process.env.api}/users?type=aluno&page=${_page}&limit=15&search=${_search}&courseId=${user.selectedCourse ? user.selectedCourse.id : ""}${parseUserActiveParam(_status)}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        const filteredUsers = response.data.users.filter(u => u.email != user.email)
        setUsers(filteredUsers);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
      });

    setFetchingUsers(false);
  }

  return (
    <>
      <Head>
        <title>Alunos - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <UserList
            title={"Alunos"}
            subRoute={"alunos"}
            users={users}
            courseId={user.selectedCourse ? user.selectedCourse.id : null}
            loading={fetchingUsers}
            totalPages={totalPages}

            onChange={() => fetchUsers(page, search, status)}
          />
        </Wrapper>
      ) : (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      )}

    </>
  );
}
