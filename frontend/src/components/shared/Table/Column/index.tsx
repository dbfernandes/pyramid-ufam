import { useEffect, useMemo, useState } from "react";
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
  const [ordinal, setOrdinal] = useState<number>(0); // Feedback to show in what position the column is being sorted

  /*
    Example: if the user is sorting by 3 columns, the first one will be the main one,
    the second one will be the secondary one, and the third one will be the tertiary one.

    The order is determined by the order the user clicked on the columns.
  */

  function mapSorting() {
    const { sort, order } = router.query;
    let foundInQuery = false;

    if (sort && order) {
      const sortArray = sort?.toString().split(",");
      const orderArray = order?.toString().split(",");

      const minLength = Math.min(sortArray.length, orderArray.length);

      const map = {};
      for (let i = 0; i < minLength; i++) {
        if (orderArray[i] !== "none") {
          map[sortArray[i]] = orderArray[i];

          if (sortBy === sortArray[i]) {
            if (["asc", "desc"].includes(orderArray[i])) {
              setSorting(orderArray[i] as ISortTypes);
            }

            foundInQuery = true;
            setOrdinal(i + 1);
          }
        }
      }

      if (sortBy === "total" && !foundInQuery) {
        setSorting("none");
        setOrdinal(0);
      }

      return map;
    }

    if (!foundInQuery) {
      setSorting("none");
      setOrdinal(0);
    }

    return {};
  }

  const sortingMap = useMemo(() => mapSorting(), [router]);

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
      const map = JSON.parse(JSON.stringify(sortingMap)); // Shallow copy

      if (newOrder === "none") {
        delete map[sortBy];
        setSorting("none");
        setOrdinal(0);
      } else {
        map[sortBy] = newOrder;
      }

      const sortArray = Object.keys(map);
      const orderArray = Object.values(map);

      const query = {
        ...router.query,
        sort: sortArray.join(","),
        order: orderArray.join(","),
      };

      router.push({ query });
    }
  }

  return (
    <ColumnStyled color={header ? "var(--muted)" : null} hideOnMobile={hideOnMobile} className={loading ? "placeholder-glow" : ""}>
      {/* Loading */}
      {loading && <span className="placeholder col-md-8 col-12" />}

      {/* Sortable header */}
      {header && sortBy && (
        <OverlayTrigger placement="top" overlay={<Tooltip>{`Ordenar ${ordinal > 0 ? `(${ordinal}°)` : ""} por ${children?.toLocaleString().toLocaleLowerCase()}: ${sortingLabels[sorting]?.label}`}</Tooltip>}>
          <Sortable className="btn btn-link" onClick={() => sort()}>
            <i className={`bi bi-chevron-${sortingLabels[sorting]?.icon}`}>
              {ordinal > 0 && <span>{ordinal}</span>}
            </i>

            <span>{children}</span>
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