import IntroTile from "./Tile/IntroTile";
import NumberTile from "./NumberTile";

// Custom
import {
  DashboardWrapper
} from "./styles";

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <IntroTile />
      <NumberTile
        icon="file-earmark-medical"
        accent="var(--danger)"
        title="solicitações pendentes"
        value="125"

        callToAction="Solicitações"
        link="/solicitacoes"
      />
      <NumberTile
        icon="person"
        accent="var(--success)"
        title="alunos neste curso"
        value="300"

        callToAction="Alunos"
        link="/usuarios/alunos"
      />
      <NumberTile
        icon="bookmark"
        accent="var(--primary-color-2)"
        title="atividades neste curso"
        value="50"

        callToAction="Atividades"
        link="/atividades"
      />
      <NumberTile
        icon="mortarboard"
        accent="var(--warning-hover)"
        title="outros cursos cadastrados"
        value="30"

        callToAction="Cursos"
        link="/cursos"
      />
    </DashboardWrapper>
  );
}