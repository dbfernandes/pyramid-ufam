import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import Dashboard from "components/pages/Painel/Dashboard";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import SubmissionList from "components/pages/Solicitacoes/SubmissionList";
import MySubmissionList from "components/pages/Solicitacoes/MySubmissionList";
import MinhasSolicitacoes from "../minhas-solicitacoes";

export default function Home() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(true);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      {
        title: "Painel"
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

  return (
    <>
      <Head>
        <title>Painel - {process.env.title}</title>
      </Head>

      {loaded
        ? <Wrapper>
          <Dashboard />
        </Wrapper>
        :<div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      }
    </>
  );
}