import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import IntroTile from "./Tile/IntroTile";
import { DashboardWrapper } from "./styles";

// Shared
import Spinner from "components/shared/Spinner";

// Custom
import DashboardAdmin from "./DashboardAdmin";
import DashboardStudent from "./DashboardStudent";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Dashboard() {
  const router = useRouter();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user?.logged) {
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
        {user.userTypeId === 3
          ? <DashboardStudent user={user} />
          : <DashboardAdmin user={user} />
        }
      </DashboardWrapper>
    </>
  );
}
