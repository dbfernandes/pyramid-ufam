import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "utils";
import NumberTile from "../NumberTile";

// Shared
import Spinner from "components/shared/Spinner";
import { toast } from "react-toastify";

import IUserLogged from "interfaces/IUserLogged";
export default function DashboardStudent({
  user
}: { user: IUserLogged }) {
  useEffect(() => {
    if (user?.selectedCourse) fetchReport(user?.id, user?.selectedCourse?.id);
  }, []);

  const [report, setReport] = useState<any>(null);
  const [fetchingReport, setFetchingReport] = useState<boolean>(true);

  async function fetchReport(userId: number, courseId: number) {
    setFetchingReport(true);

    const options = {
      url: `${process.env.api}/users/${userId}/report/${courseId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
    };

    await axios
      .request(options as AxiosRequestConfig)
      .then((response) => {
        console.log(response.data);
        setReport(response.data);
      })
      .catch((error) => handleFetchError(error));

    setFetchingReport(false);
  }

  function handleFetchError(error) {
    const errorMessages = {
      0: "Oops, tivemos um erro. Tente novamente.",
      500: error?.response?.data?.message,
    };
    const code = error?.response?.status ? error.response.status : 500;
    toast.error(code in errorMessages ? errorMessages[code] : errorMessages[0]);
  }

  return (
    fetchingReport
      ? <Spinner />
      : <>
        <NumberTile
          icon="file-earmark-check"
          accent="var(--success)"
          title="horas concluídas"
          value={`${report?.workloadCount?.totalWorkload}/${report?.course.minWorkload}`}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=3"
        />
        <NumberTile
          icon="file-earmark-medical"
          accent="var(--danger)"
          title="submissões a serem avaliadas"
          value={report?.pendingSubmissions}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=1"
        />
        <NumberTile
          icon="file-earmark-medical"
          accent="var(--warning-hover)"
          title="submissões pré-aprovadas"
          value={report?.preApprovedSubmissions}
          callToAction="Visualizar"
          link="/minhas-solicitacoes?page=1&search=&status=2"
        />
      </>
  );
}
