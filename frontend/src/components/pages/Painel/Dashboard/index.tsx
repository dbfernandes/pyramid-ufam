import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import axios, { AxiosRequestConfig } from "axios";

import IntroTile from "./Tile/IntroTile";
import NumberTile from "./NumberTile";
import { DashboardWrapper } from "./styles";

// Shared
import { ActivityGroupsNames } from "constants/activityGroups.constants";
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import toast from "components/shared/Toast";

// Custom
import SubmissionList, { countPendingSubmissions } from "components/pages/Solicitacoes/SubmissionList"; // Importando a função countPendingSubmissions

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
      fetchUsers(1, "", "active");
      setTimeout(() => setLoaded(true), 250);
    }
  }, [user]);

  // Função para buscar as submissões
  async function fetchSubmissions() {
    setFetchingSubmissions(true);

    const options = {
      url: `${process.env.api}/courses/${user.selectedCourse?.id}/submissions?page=1&limit=15&search=&status=1`, // Defina os parâmetros de busca conforme necessário
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    try {
      if(user.userTypeId != 3){
        const response = await axios.request(options as AxiosRequestConfig);
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      const errorMessages = {
        0: "Oops, tivemos um erro. Tente novamente.",
        500: error?.response?.data?.message,
      };

      const code = error?.response?.status ? error.response.status : 500;
      toast("Erro", code in errorMessages ? errorMessages[code] : errorMessages[0], "danger");
    }

    setFetchingSubmissions(false);
  }


  async function fetchUsers(_page, _search, _status) {
    setFetchingUsers(true);

    const options = {
      url: `${process.env.api}/users?type=aluno&page=${_page}&limit=15&search=${_search}&courseId=${user.selectedCourse ? user.selectedCourse.id : ""}&status=${_status}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`,
      },
    };

    try {
      if(user.userTypeId != 3){
        const response = await axios.request(options as AxiosRequestConfig);
        // Filtrar os usuários para não incluir o usuário logado
        const filteredUsers = response.data.users.filter(u => u.email !== user.email);
        setUsers(filteredUsers);
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
          }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      )}

      <DashboardWrapper>
        <IntroTile />
        {loaded && user.userTypeId !== 3 ? ( // Verifica se o usuário não é do tipo aluno
          <>
            <NumberTile
              icon="file-earmark-medical"
              accent="var(--danger)"
              title="solicitações pendentes"
              value={countPendingSubmissions(submissions)}
              callToAction="Solicitações"
              link="/solicitacoes"
            />
            <NumberTile
              icon="person"
              accent="var(--success)"
              title="Alunos no Curso"
              value={users.length}
              callToAction="Alunos"
              link="/usuarios/alunos"
            />
          </>
        ) : (
          <></>
        )}
      </DashboardWrapper>
    </>
  );
}
