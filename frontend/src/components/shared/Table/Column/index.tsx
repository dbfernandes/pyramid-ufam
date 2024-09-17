import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Custom
import { ColumnStyled, Sortable } from "./styles";

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
  const router = useRouter();

  const sortingLabels = {
    asc: {
      icon: "up",
      label: isNumeric ? "1 a 9" : "A a Z",
    },
    desc: {
      icon: "down",
      label: isNumeric ? "9 a 1" : "Z a A",
    },
    none: {
      icon: "expand",
      label: "-",
    },
  }

  type ISortTypes = "asc" | "desc" | "none";
  const [sorting, setSorting] = useState<ISortTypes>("none");

  function mapSorting() {
    const { sort, order } = router.query;

    if (sort && order) {
      const sortArray = sort?.toString().split(",");
      const orderArray = order?.toString().split(",");

      const minLength = Math.min(sortArray.length, orderArray.length);

      const map = {};
      let foundInQuery = false;

      for (let i = 0; i < minLength; i++) {
        map[sortArray[i]] = orderArray[i];

        if (sortBy === sortArray[i] && ["asc", "desc"].includes(orderArray[i])) {
          setSorting(orderArray[i] as "asc" | "desc");
          foundInQuery = true;
        }
      }

      if (!foundInQuery) {
        setSorting("none");
      }

      return map;
    }

    return {};
  }

  useEffect(() => {
    mapSorting();
  }, [router]);

  function sort() {
    function toggleSorting() {
      let next: ISortTypes;
      if (sorting === "asc") {
        next = "desc";
      } else if (sorting === "desc") {
        next = "none";
      } else {
        next = "asc";
      }

      setSorting(next);
      return next;
    }

    if (sortBy) {
      const newOrder = toggleSorting();
      const map = mapSorting();

      if (newOrder === "none" && sortBy in map) {
        delete map[sortBy];
      } else {
        map[sortBy] = newOrder;
      }

      const sortArray = Object.keys(map);
      const orderArray = Object.values(map);

      router.push({
        query: {
          ...router.query,
          sort: sortArray.join(","),
          order: orderArray.join(","),
        },
      });
    }
  }

  return (
    <ColumnStyled color={header ? "var(--muted)" : null} hideOnMobile={hideOnMobile} className={loading ? "placeholder-glow" : ""}>
      {/* Loading */}
      {loading && <span className="placeholder col-md-8 col-12" />}

      {/* Sortable header */}
      {header && sortBy && (
        <OverlayTrigger placement="top" overlay={<Tooltip>{`Ordenar por ${children?.toLocaleString().toLocaleLowerCase()}: ${sortingLabels[sorting]?.label}`}</Tooltip>}>
          <Sortable className="btn btn-link" onClick={() => sort()}>
            <span>{children}</span>
            <i className={`bi bi-chevron-${sortingLabels[sorting]?.icon}`} />
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