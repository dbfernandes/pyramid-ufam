import { H5 } from "components/shared/Titles";
import { getFirstName } from "utils";
import { useDispatch, useSelector } from "react-redux";
import { defaultCourse } from "redux/slicer/user";

// Custom
import { CallToAction, TileWrapper } from "../styles";

// Interfaces
import { IRootState } from "redux/store";
import IUserLogged from "interfaces/IUserLogged";

export default function IntroTile() {
  const dispatch = useDispatch();
  const user = useSelector<IRootState, IUserLogged>((state) => state.user);

  return (
    <TileWrapper>
      <div>
        <H5>Bem vindo(a), {getFirstName(user?.name)}!</H5>
        {user?.userTypeId == 3 
         ? <p>Você pode submeter uma nova solicitação</p>
         : (
          <p>Atualmente você está gerenciando o curso de <b>{user?.selectedCourse?.name}</b>.</p>
        )}
      </div>

      {user?.userTypeId == 3 ? (
        <CallToAction as="a" href="/minhas-solicitacoes/nova">
          <i className="bi bi-file-earmark-check" />
          Nova submissão
        </CallToAction>
      ) : (
        <CallToAction onClick={() => dispatch(defaultCourse(null))}>
          <i className="bi bi-arrow-left-right" />
          Trocar de curso
        </CallToAction>
      )}
    </TileWrapper>
  );
}
