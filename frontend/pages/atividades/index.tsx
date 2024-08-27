import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";
import { restrictPageForLoggedUsers } from "utils";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import ActivityGroups from "components/pages/Atividades/ActivityGroups";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";
import { DefaultWrapper } from "components/shared/Wrapper/styles";
import { H3 } from "components/shared/Titles";
import { CourseGridComponent } from "components/shared/EnrollmentGrid/styles";

export default function Atividades() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

  // Setting links used in breadcrumb
  useEffect(() => {
    setLinks([
      {
        title: "Grupos de atividades",
      },
    ]);
  }, []);

  // Verifying user
  useEffect(() => {
    restrictPageForLoggedUsers(user, router, setLoaded, [1, 2]);
  }, [user]);

  return (
    <>
      <Head>
        <title>Grupos de atividades - {process.env.title}</title>
      </Head>

      {loaded ? (
        <Wrapper>
          <DefaultWrapper>
            <H3 style={{ paddingBottom: "0.5rem" }}>Grupos de atividades</H3>
            <CourseGridComponent>
            <ActivityGroups
              link="/atividades/"
            />
  
            </CourseGridComponent>
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