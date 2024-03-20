import IntroTile from "./IntroTile";
import Tile from "./Tile";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <IntroTile />
      <div className="dashboard__tiles">
        <Tile title="Vendas" value="R$ 0,00" />
        <Tile title="Clientes" value="0" />
        <Tile title="Produtos" value="0" />
        <Tile title="Pedidos" value="0" />
      </div>
    </div>
  );
}