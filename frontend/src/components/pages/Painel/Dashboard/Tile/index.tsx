import { TileWrapper } from "./styles";

// Interfaces
interface ITileProps {
  children?: React.ReactNode;
}

export default function Tile({
  children
}: ITileProps) {
  return (
    <TileWrapper>
      {children}
    </TileWrapper>
  );
}