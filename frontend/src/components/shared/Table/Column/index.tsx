import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

// Custom
import { ColumnStyled, Sortable } from "./styles";

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
      label: "Não Selecionado",
    },
  };

  type ISortTypes = "asc" | "desc" | "none";
  const [sorting, setSorting] = useState<ISortTypes>(() => (sortBy === "name" ? "asc" : "none"));
  const [ordinal, setOrdinal] = useState<number>(0);

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

      if (!foundInQuery) {
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

  function toggleSorting() {
    let next: ISortTypes;

    if (sortBy === "name") {
      // Ciclo: asc -> desc -> none -> asc
      if (sorting === "asc") {
        next = "desc";  // Primeiro clique: asc -> desc
      } else if (sorting === "desc") {
        next = "none";  // Segundo clique: desc -> none
      } else {
        next = "asc";   // Terceiro clique: none -> asc
      }
    } else {
      // Ciclo padrão: none -> asc -> desc -> asc
      if (sorting === "none") {
        next = "asc";   // Para outras colunas, primeiro clique vai para asc
      } else if (sorting === "asc") {
        next = "desc";  // Segundo clique: asc -> desc
      } else {
        next = "asc";   // Terceiro clique: desc -> asc
      }
    }

    setSorting(next);
    return next;
  }

  function sort() {
    if (sortBy) {
      const newOrder = toggleSorting();
      const map = JSON.parse(JSON.stringify(sortingMap));

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

  useEffect(() => {
    const { sort, order } = router.query;

    if (!sort && !order && sortBy === "name") {
      const query = {
        ...router.query,
        sort: "name",
        order: "asc",
      };
      router.replace({ query });
      setSorting("asc");
      setOrdinal(1);
    }
  }, [router, sortBy]);

  return (
    <ColumnStyled
      color={header ? "var(--muted)" : null}
      hideOnMobile={hideOnMobile}
      className={loading ? "placeholder-glow" : ""}
    >
      {loading && <span className="placeholder col-md-8 col-12" />}

      {header && sortBy && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              {`Ordenar ${
                ordinal > 0 ? `(${ordinal}°)` : ""
              } por ${children?.toLocaleString().toLocaleLowerCase()}: ${
                sortingLabels[sorting]?.label
              }`}
            </Tooltip>
          }
        >
          <Sortable className="btn btn-link" onClick={() => sort()}>
            <i className={`bi bi-chevron-${sortingLabels[sorting]?.icon}`}>
              {ordinal > 0 && <span>{ordinal}</span>}
            </i>
            <span>{children}</span>
          </Sortable>
        </OverlayTrigger>
      )}

      {tooltip && (
        <OverlayTrigger placement="bottom" overlay={<Tooltip>{tooltip}</Tooltip>}>
          <span>{children}</span>
        </OverlayTrigger>
      )}

      {!tooltip && !sortBy && <span>{children}</span>}
    </ColumnStyled>
  );
}

export default Column;
