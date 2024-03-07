import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import Courses from "components/pages/Cursos/Courses";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import toast from "components/shared/Toast";

export default function Cursos() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      {
        title: "Cursos",
      },
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

  // Courses
  const [courses, setCourses] = useState<any[]>([]);
  const [fetchingCourses, setFetchingCourses] = useState<boolean>(true);
  const [search, setSearch] = useState<string>(router.query.search ? router.query.search.toString() : "");
  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string) : 1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Fetching courses
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
      router.replace(`/cursos?page=1&search=${search}`);
    }
    if (page > 0) {
      fetchCourses();
    }
  }, [page]);

  async function fetchCourses() {
    setFetchingCourses(true);

    const options = {
      url: `${process.env.api}/courses?page=${page}&limit=16&search=${search}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        const errorMessages = {
          0: "Oops, tivemos um erro. Tente novamente.",
          500: error?.response?.data?.message,
        };

        const code = error?.response?.status ? error.response.status : 500;
        toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
      });

    setFetchingCourses(false);
  }

  return (
    <>
      <Head>
        <title>Cursos - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          {fetchingCourses
            ? (
              <div
                style={{
                  height: "100vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner size={"30px"} color={"var(--primary-color)"} />
              </div>
            )
            : <Courses
              courses={courses}
              page={page}
              totalPages={totalPages}
              search={search}
              setSearch={setSearch}
              onChange={fetchCourses}
            />
          }
        </Wrapper>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      )}
    </>
  );
}
