import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import RequestList from "components/pages/Solicitacoes/RequestList";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Solicitacoes() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      {
        title: "Usuários",
      },
      {
        title: "Alunos",
        route: "/usuarios/alunos"
      },
      {
        title: `Aluno ${router.query.id}`,
        route: `/usuarios/alunos/${router.query.id}`
      },
      {
        title: "Submissões"
      }
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

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(60);
  useEffect(() => {
    if (router.query.page) {
      setPage(parseInt(router.query.page as string));
    }
  }, [router]);

  // Mock
  const _requests = [
    {
      user: { id: 1, enrollment: "256123456", name: "Guilherme Almeida", email: "teste@gmail.com", cpf: "123.456.789-00", course: "Engenharia de Software" },
      id: 1,
      activityGroup: "Ensino",
      activityType: "Participação em Monitoria",
      workload: "30h/40h",
      description: "Certificado de participação em monitoria",
      status: 1
    },
    {
      user: { id: 1, enrollment: "256123456", name: "Guilherme Almeida", email: "teste@gmail.com", cpf: "123.456.789-00", course: "Engenharia de Software" },
      id: 2,
      activityGroup: "Pesquisa",
      activityType: "Participação em Monitoria",
      workload: "30h/40h",
      description: "Certificado de participação em monitoria",
      status: 2
    },
    {
      user: { id: 1, enrollment: "256123456", name: "Guilherme Almeida", email: "teste@gmail.com", cpf: "123.456.789-00", course: "Engenharia de Software" },
      id: 3,
      activityGroup: "Extensão",
      activityType: "Participação em Monitoria",
      workload: "30h/40h",
      description: "Certificado de participação em monitoria",
      status: 3
    },
    {
      user: { id: 1, enrollment: "256123456", name: "Guilherme Almeida", email: "teste@gmail.com", cpf: "123.456.789-00", course: "Engenharia de Software" },
      id: 4,
      activityGroup: "Extensão",
      activityType: "Participação em Monitoria",
      workload: "30h/40h",
      description: "Certificado de participação em monitoria",
      status: 4
    }
  ];

  return (
    <>
      <Head>
        <title>Submissões - [Nome do aluno] - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <RequestList requests={_requests} loading={false} page={page} totalPages={totalPages} />
        </Wrapper>
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
    </>
  );
}
