import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useBreadcrumb } from "contexts/BreadcrumbContext";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";
import ActivityGroup from "components/pages/Atividades/ActivityGroup";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function CoursePage() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);
  const { setLinks } = useBreadcrumb();

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

  // Setting links used in breadcrumb
  useEffect(() => {
    // if (!isLoading)
    setLinks([
      {
        title: "Cursos",
        route: "/cursos",
      },
      {
        title: "TESTE",
      },
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>
          Nome do curso - {process.env.title}
        </title>
      </Head>

      {loaded ? (
        <Wrapper>
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
