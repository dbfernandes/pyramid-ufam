import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import ActivitySelect from "components/shared/forms/FormAddSubmission/ActivitySelect";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import { H3 } from "components/shared/Titles";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function SolicitacoesAtividades() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      {
        title: "Solicitações",
      },
      {
        title: "Atividades",
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

  const [activity, setActivity] = useState<any | null>(null);
  useEffect(() => {
    if (activity != null) {
      router.push(`/solicitacoes/atividade/${activity.id}`);
    }
  }, [activity]);

  return (
    <>
      <Head>
        <title>Solicitações por atividade - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <DefaultWrapper>
            <H3 style={{ marginBottom: 35 }}>Solicitações por atividade</H3>

            <div style={{ width: "60%" }}>
              <ActivitySelect
                activity={activity}
                setActivity={setActivity}
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