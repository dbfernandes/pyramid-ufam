// Interfaces
interface ITileProps {
  title: string;
  value: string;
}

export default function Tile({
  title,
  value
}: ITileProps) {
  return (
    <div className="tile">
      <div className="tile__title">{title}</div>
      <div className="tile__value">{value}</div>
    </div>
  );
}