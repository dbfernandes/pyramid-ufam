import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import UserList from "components/shared/UserList";
import toast from "components/shared/Toast";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Alunos() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      { title: "Usuários" },
      { title: "Alunos" },
    ]);

    fetchUsers();
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
  const [search, setSearch] = useState<string>(router.query.search ? router.query.search.toString() : "");
  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string) : 1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Fetching users
  useEffect(() => {
    if (router.query) {
      const _page = parseInt(router.query.page as string);
      const _search = router.query.search as string;

      if (_page && page !== _page) setPage(_page);
      if (_search && search !== _search) setSearch(_search);
    }
  }, [router]);

  useEffect(() => {
    if (search.length > 0 || search !== router.query.search) setPage(0);
  }, [search]);

  useEffect(() => {
    if (page == 0) {
      router.replace(`/usuarios/alunos?page=1&search=${search}`);
      return;
    }
    if (page > 0) {
      fetchUsers();
    }
  }, [page]);

  async function fetchUsers() {
    setFetchingUsers(true);

    const options = {
      url: `${process.env.api}/users?type=aluno&page=${page}&limit=15&search=${search}&courseId=${user.selectedCourse ? user.selectedCourse.id : ""}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setFetchingUsers(false);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
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
            courseId={user.selectedCourse ? user.selectedCourse.id : null}
            loading={fetchingUsers}
            page={page}
            totalPages={totalPages}
            users={users}
            subRoute={"alunos"}
            search={search}
            setSearch={setSearch} />
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
