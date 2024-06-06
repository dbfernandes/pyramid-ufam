import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";
import { parseUserActiveParam } from "utils";

import IntroTile from "./Tile/IntroTile";
import NumberTile from "./NumberTile";
import { DashboardWrapper } from "./styles";

// Shared
import { ActivityGroupsNames } from "constants/activityGroups.constants";
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import toast from "components/shared/Toast";

// Custom
import SubmissionList, { countPendingSubmissions, countPreAprovedSubmissions } from "components/pages/Solicitacoes/SubmissionList"; // Importando a função countPendingSubmissions

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Dashboard() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();
  const [users, setUsers] = useState<any[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState<boolean>(true);
  const [totalActiveUsers, setTotalActiveUsers] = useState<number>(0);
  const [totalInactiveUsers, setTotalInactiveUsers] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);

  useEffect(() => {
    if (!user.logged) {
      router.replace("/entrar");
    } else if (user.selectedCourse == null) {
      router.replace("/conta/curso");
    } else {
      setTimeout(() => setLoaded(true), 250);
    }
  }, [user]);

  const [submissions, setSubmissions] = useState<any[]>([]);
  const [fetchingSubmissions, setFetchingSubmissions] = useState<boolean>(true);

  useEffect(() => {
    if (!user.logged) {
      router.replace("/entrar");
    } else if (user.selectedCourse == null) {
      router.replace("/conta/curso");
    } else {
      fetchSubmissions();
      fetchUsers(0, "", "active");
      setTimeout(() => setLoaded(true), 250);
    }
  }, [user.logged, user.selectedCourse]);

  async function fetchSubmissions() {
    setFetchingSubmissions(true);

    const options = {
      url: `${process.env.api}/courses/${user.selectedCourse?.id}/submissions?page=&limit=&search=&status=`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    if(user.userTypeId !== 3) {
      const response = await axios.request(options as AxiosRequestConfig);
      setSubmissions(response.data.submissions);
    }

    setFetchingSubmissions(false);
  }

  async function fetchUsers(_page, _search, _status) {
    setFetchingUsers(true);

    const options = {
      url: `${process.env.api}/users?type=aluno&search=${_search}&courseId=${user.selectedCourse ? user.selectedCourse.id : ""}&status=${_status}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    try {
      if (user.userTypeId !== 3) {
        const response = await axios.request(options as AxiosRequestConfig);
        const filteredUsers = response.data.users.filter(u => u.email !== user.email);
        setUsers(filteredUsers);

        const activeUsers = filteredUsers.filter(u => u.isActive);
        setTotalActiveUsers(activeUsers.length);
      }
    } catch (error) {
      handleFetchError(error);
    }

    setFetchingUsers(false);
  }

  function handleFetchError(error) {
    const errorMessages = {
      0: "Oops, tivemos um erro. Tente novamente.",
      500: error?.response?.data?.message,
    };
    const code = error?.response?.status ? error.response.status : 500;
    toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
  }

  function handlePreApprovedClick() {
    router.push("/solicitacoes?page=&search=&status=2");
  }

  return (
    <>
      <Head>
        <title>Dashboard - {process.env.title}</title>
      </Head>

      {loaded ? (
        <></>
      ) : (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      )}

      <DashboardWrapper>
        <IntroTile />
        { user.userTypeId == 2 || user.userTypeId == 1 ? (
          <>
            <NumberTile
              icon="file-earmark-medical"
              accent="var(--danger)"
              title="Solicitações pendentes"
              value={countPendingSubmissions(submissions)}
              callToAction="Solicitações"
              link="/solicitacoes?page=1&search=&status=1"
            />
            <NumberTile
              icon="file-earmark-medical"
              accent="var(--danger)"
              title="Solicitações pré-aprovadas"
              value={countPreAprovedSubmissions(submissions)}
              callToAction="Solicitações"
              link="/solicitacoes?page=1&search=&status=2"
            />
            <NumberTile
              icon="person"
              accent="var(--success)"
              title="Alunos no curso"
              value={totalActiveUsers}
              callToAction="Alunos"
              link="/usuarios/alunos"
            />
          </>
        ) : (
          <>
          </>
        )}
      </DashboardWrapper>
    </>
  );
}
