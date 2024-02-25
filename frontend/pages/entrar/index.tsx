import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

// Shared
import Wrapper from "components/shared/Wrapper";
import Spinner from "components/shared/Spinner";

// Custom
import FormLogin from "components/shared/forms/FormLogin";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Entrar() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>(state => state.user);
  const [loaded, setLoaded] = useState(false);

  // Verifying user
  useEffect(() => {
    if (user.logged) {
      router.replace("/painel");
    } else {
      setTimeout(() => setLoaded(true), 250);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Entrar - {process.env.title}</title>
      </Head>

      {loaded
        ? <Wrapper centerAlign={true}>
          <FormLogin />
        </Wrapper>
        : <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner size={"30px"} color={"var(--primary-color)"} />
        </div>
      }
    </>
  );
}