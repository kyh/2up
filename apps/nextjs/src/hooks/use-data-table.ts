"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";

import type {
  ColumnDef,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

type UseDataTableProps<TData, TValue> = {
  /**
   * The data for the table.
   * @default []
   * @type TData[]
   */
  data: TData[];

  /**
   * The columns of the table.
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * The number of pages in the table.
   * @type number
   */
  pageCount: number;

  /**
   * The default number of rows per page.
   * @default 10
   * @type number | undefined
   * @example 20
   */
  defaultPerPage?: number;

  /**
   * The default sort order.
   * @default undefined
   * @type `${Extract<keyof TData, string | number>}.${"asc" | "desc"}` | undefined
   * @example "createdAt.desc"
   */
  defaultSort?: `${Extract<keyof TData, string | number>}.${"asc" | "desc"}`;
};

const schema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().optional(),
  sort: z.string().optional(),
});

export const useDataTable = <TData, TValue>({
  data,
  columns,
  pageCount,
  defaultPerPage = 10,
  defaultSort,
}: UseDataTableProps<TData, TValue>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search params
  const search = schema.parse(Object.fromEntries(searchParams));
  const page = search.page;
  const perPage = search.per_page ?? defaultPerPage;
  const sort = search.sort ?? defaultSort;
  const [column, order] = sort?.split(".") ?? [];

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Table states
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: page - 1,
      pageSize: perPage,
    });

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        per_page: pageSize,
      })}`,
      {
        scroll: false,
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  // Handle server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? "",
      desc: order === "desc",
    },
  ]);

  React.useEffect(() => {
    router.push(
      `${pathname}?${createQueryString({
        page,
        sort: sorting[0]?.id
          ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
          : null,
      })}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
  });

  return { table };
};
