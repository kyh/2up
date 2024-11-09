import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

import type {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  Table,
  TableMeta,
  VisibilityState,
} from "@tanstack/react-table";

export type UseDataTableProps<TData> = {
  // The rows to display in the table
  data?: TData[];
  // The columns to display in the table
  columns?: ColumnDef<TData>[];
  sorting?: SortingState;
  setSorting?: OnChangeFn<SortingState>;
  columnVisibility?: VisibilityState;
  setColumnVisibility?: OnChangeFn<VisibilityState>;
  columnOrder?: ColumnOrderState;
  setColumnOrder?: OnChangeFn<ColumnOrderState>;
  columnSizing?: ColumnSizingState;
  setColumnSizing?: OnChangeFn<ColumnSizingState>;
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState>;
  // This callback is called when the user has finished resizing a specific column
  // It will be called with a single `{ [columnId]: width }` object
  onResizeColumn?: (columnId: string, columnSize: number) => void;
  meta?: TableMeta<TData>;
};

export type UseDataTableReturn<TData> = {
  table: Table<TData>;
  meta?: TableMeta<TData>;
} & Omit<UseDataTableProps<TData>, "data" | "columns">;

export const useDataTable = <TData,>({
  data = [],
  columns = [],
  meta,
  ...props
}: UseDataTableProps<TData> = {}): UseDataTableReturn<TData> => {
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
    manualPagination: true,
    onColumnVisibilityChange: props.setColumnVisibility,
    onSortingChange: props.setSorting,
    onRowSelectionChange: props.setRowSelection,
    onColumnOrderChange: props.setColumnOrder,
    onColumnSizingChange: props.setColumnSizing,
    defaultColumn: {
      minSize: 40,
      maxSize: 800,
    },
    columnResizeMode: "onEnd",
    state: {
      sorting: props.sorting,
      columnVisibility: props.columnVisibility,
      rowSelection: props.rowSelection,
      columnOrder: props.columnOrder,
      columnSizing: props.columnSizing,
    },
    getRowId: (row) => {
      if (typeof row === "object" && row !== null && "id" in row)
        return row.id as string;
      return `${row}`;
    },
    meta,
  });

  return {
    table,
    ...props,
  };
};

export type {
  ColumnDef,
  ColumnOrderState,
  ColumnSizingState,
  RowSelectionState,
  SortingState,
  VisibilityState,
};
