import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ColumnStyled } from "./styles";
import { useState } from "react";

// Custom
import { Sortable } from "./styles";

// Interfaces
interface IColumnProps {
  sortBy?: string;
  isNumeric?: boolean;
  tooltip?: string | React.ReactNode;
  loading?: boolean;
  hideOnMobile?: boolean;
  header?: boolean;
  children?: React.ReactNode;
}

export function Column({
  sortBy,
  isNumeric = false,
  tooltip,
  loading = false,
  hideOnMobile = false,
  header = false,
  children,
  ...props
}: IColumnProps) {
  const sortingIcons = {
    asc: "up",
    desc: "down",
    none: "expand",
  }
  const sortingLabels = {
    asc: isNumeric ? "1 a 9" : "A a Z",
    desc: isNumeric ? "9 a 1" : "Z a A",
    none: "-",
  }
  const [sorting, setSorting] = useState<"asc" | "desc" | "none">("none");
  //const [sortKey, setSortKey] = useState<string | null>(null);

  function toggleSorting() {
    if (sorting === "asc") {
      setSorting("desc");
    } else if (sorting === "desc") {
      setSorting("none");
    } else {
      setSorting("asc");
    }
  }

  return (
    <ColumnStyled color={header ? "var(--muted)" : null} hideOnMobile={hideOnMobile} className={loading ? "placeholder-glow" : ""}>
      {/* Loading */}
      {loading && <span className="placeholder col-md-8 col-12" />}

      {/* Sortable header */}
      {header && sortBy && (
        <OverlayTrigger placement="top" overlay={<Tooltip>{`Ordenar por ${children?.toLocaleString().toLocaleLowerCase()}: ${sortingLabels[sorting]}`}</Tooltip>}>
          <Sortable className="btn btn-link" onClick={toggleSorting}>
            <span>{children}</span>
            <i className={`bi bi-chevron-${sortingIcons[sorting]}`} />
          </Sortable>
        </OverlayTrigger>
      )}

      {/* Tooltip */}
      {tooltip && (
        <OverlayTrigger placement="bottom" overlay={<Tooltip>{tooltip}</Tooltip>}>
          <span>{children}</span>
        </OverlayTrigger>
      )}

      {/* Default */}
      {!tooltip && !sortBy && <span>{children}</span>}
    </ColumnStyled>
  );
}

export default Column;