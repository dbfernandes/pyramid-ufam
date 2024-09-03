import { useSelector } from "react-redux";

import IntroTile from "./Tile/IntroTile";
import { DashboardWrapper } from "./styles";

// Custom
import DashboardAdmin from "./DashboardAdmin";
import DashboardStudent from "./DashboardStudent";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function Dashboard() {
  const userLogged = useSelector<IRootState, IUserLogged>((state) => state.user);

  return (
    <DashboardWrapper>
      <IntroTile />

      {userLogged?.userTypeId === 3
        ? <DashboardStudent userLogged={userLogged} />
        : <DashboardAdmin userLogged={userLogged} />
      }
    </DashboardWrapper>
  );
}
