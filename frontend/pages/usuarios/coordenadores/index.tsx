import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";
import { parseUserActiveParam, restrictPageForLoggedUsers } from "utils";
import { toast } from "react-toastify";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import UserList from "components/shared/UserList";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Coordenadores() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    const url = router.asPath;
    if (!url.includes("page") || !url.includes("search") || !url.includes("status")) {
      router.replace(`${url.split("?")[0]}?page=1&search=&status=1`);
    }

    setLinks([
      { title: "Usuários" },
      { title: "Coordenadores" },
    ]);
  }, []);

  // Verifying user
  useEffect(() => {
    restrictPageForLoggedUsers(user, router, setLoaded, [1]);
  }, [user]);

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(true);

  // Fetching users
  const {
    page: pageInitial,
    search: searchInitial,
    status: statusInitial,
    sort: sortInitial,
    order: orderInitial
  } = router.query;

  const [page, setPage] = useState<number>(pageInitial ? parseInt(pageInitial as string) : 1);
  const [search, setSearch] = useState<string>(searchInitial ? searchInitial as string : "");
  const [status, setStatus] = useState<string>(statusInitial ? statusInitial as string : "1");
  const [sort, setSort] = useState<string>(sortInitial ? sortInitial as string : "");
  const [order, setOrder] = useState<string>(orderInitial ? orderInitial as string : "");

  const [totalPages, setTotalPages] = useState<number>(0);
  const itensPerPage = 15;
  const [totalItens, setTotalItens] = useState<number>(0);

  useEffect(() => {
    const {
      page: pageReload,
      search: searchReload,
      status: statusReload,
      sort: sortReload,
      order: orderReload
    } = router.query;

    const _page = parseInt(pageReload as string);
    const _search = searchReload as string;
    const _status = statusReload as string;
    const _sort = sortReload as string;
    const _order = orderReload as string;

    if (_page !== undefined && _status !== undefined && _search !== undefined) {
      setPage(_page);
      setSearch(_search);
      setStatus(_status);

      if (_sort !== undefined) {
        setSort(_sort);
      }
      if (_order !== undefined) {
        setOrder(_order);
      }

      fetchUsers(_page, _search, _status, _sort, _order);
    }
  }, [router]);

  async function fetchUsers(_page, _search, _status, _sort, _order) {
    setFetchingUsers(true);

    const options = {
      url: `${process.env.api}/users?type=coordenador&page=${_page}&limit=${itensPerPage}&search=${_search}${parseUserActiveParam(_status)}${_sort ? `&sort=${_sort}` : ""}${_order ? `&order=${_order}` : ""}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
        setTotalItens(response.data.totalItens);
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
        <title>Coordenadores - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <UserList
            title={"Coordenadores"}
            subRoute={"coordenadores"}
            users={users}
            courseId={user.selectedCourse ? user.selectedCourse.id : null}
            loading={fetchingUsers}
            totalPages={totalPages}
            itensPerPage={itensPerPage}
            totalItens={totalItens}

            onChange={() => fetchUsers(page, search, status, sort, order)}
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
