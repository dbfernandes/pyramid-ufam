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
import SubmissionList from "components/pages/Solicitacoes/SubmissionList";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Solicitacoes() {
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
      {
        title: "Submissões",
      },
    ]);
  }, []);

  // Verifying user
  useEffect(() => {
    if (!user.logged) {
      router.replace("/entrar");
    } else if (user.selectedCourse === null) {
      router.replace("/conta/curso");
    } else {
      setTimeout(() => setLoaded(true), 250);
    }
  }, [user]);

  // Submissions
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [fetchingSubmissions, setFetchingSubmissions] = useState<boolean>(true);

  // Fetching submissions
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

      fetchSubmissions(_page, _search, _status);
    }
  }, [router]);

  async function fetchSubmissions(_page, _search, _status) {
    setFetchingSubmissions(true);

    const options = {
      url: `${process.env.api}/courses/${user.selectedCourse?.id}/submissions?page=${_page}&limit=15&search=${_search}&status=${_status}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        setSubmissions(response.data.submissions);
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

    setFetchingSubmissions(false);
  }

  return (
    <>
      <Head>
        <title>Submissões ({user?.selectedCourse?.name}) - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <SubmissionList
            subTitle={user?.selectedCourse?.name}
            submissions={submissions}
            loading={fetchingSubmissions}
            totalPages={totalPages}

            onChange={() => fetchSubmissions(page, search, status)}
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
