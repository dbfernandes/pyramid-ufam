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
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  return (
    <DashboardWrapper>
      <IntroTile />
      {user.userTypeId === 3
        ? <DashboardStudent user={user} />
        : <DashboardAdmin user={user} />
      }
    </DashboardWrapper>
  );
}
