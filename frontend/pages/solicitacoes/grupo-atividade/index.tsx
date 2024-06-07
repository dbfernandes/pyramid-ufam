import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import ActivityGroups from "components/pages/Atividades/ActivityGroups";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import { H3 } from "components/shared/Titles";

export default function SolicitacoesGruposAtividades() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      {
        title: "Submissões",
      },
      {
        title: "Grupos de atividade",
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

  return (
    <>
      <Head>
        <title>Submissões por grupo de atividade - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <DefaultWrapper>
            <H3 style={{ marginBottom: 35 }}>Grupos de atividades</H3>

            <div style={{ width: "60%" }}>
              <ActivityGroups
                link="/solicitacoes/grupo-atividade/"
                grid="repeat(3, 1fr)"
              />
            </div>
          </DefaultWrapper>
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