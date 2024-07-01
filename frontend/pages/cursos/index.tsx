import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import Courses from "components/pages/Cursos/Courses";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Cursos() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    const url = router.asPath;
    if (!url.includes("page") || !url.includes("search")) {
      router.replace(`${url.split("?")[0]}?page=1&search=`);
    }

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

  // Fetching courses
  const [page, setPage] = useState<number>(router.query.page ? parseInt(router.query.page as string) : 1);
  const [search, setSearch] = useState<string>(router.query.search ? router.query.search as string : "");

  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const _page = parseInt(router.query.page as string);
    const _search = router.query.search as string;

    if (_page !== undefined && _search !== undefined) {
      setPage(_page);
      setSearch(_search);

      fetchCourses(_page, _search);
    }
  }, [router]);

  async function fetchCourses(_page, _search) {
    setFetchingCourses(true);

    const options = {
      url: `${process.env.api}/courses?page=${_page}&limit=16&search=${_search}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
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
        toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
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
          <Courses
            courses={courses}
            loading={fetchingCourses}
            totalPages={totalPages}

            onChange={() => fetchCourses(page, search)}
          />
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
