import { ColumnSort } from "@tanstack/react-table";
import { useState } from "react";


export default function useSorting() {
  const [sorting, setSorting] = useState<ColumnSort[]>([])

  return {
    sorting,
    onSortingChange: setSorting,
    order: sorting.length && sorting[0].id ? (sorting[0].desc ? 'DESC' : "ASC") : undefined,
    field: sorting.length ? sorting[0].id : undefined
  };
}
