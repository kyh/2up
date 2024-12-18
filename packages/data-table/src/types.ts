import type { SQL } from "drizzle-orm";
import type { z } from "zod";

import type { DataTableConfig } from "./config";
import type { filterSchema } from "./parsers";
import type { ColumnSort, Row } from "@tanstack/react-table";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export type SearchParams = Record<string, string | string[] | undefined>;

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
};

export type ExtendedColumnSort<TData> = {
  id: StringKeyOf<TData>;
} & Omit<ColumnSort, "id">;

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type ColumnType = DataTableConfig["columnTypes"][number];

export type FilterOperator = DataTableConfig["globalOperators"][number];

export type JoinOperator = DataTableConfig["joinOperators"][number]["value"];

export type DataTableFilterField<TData> = {
  id: StringKeyOf<TData>;
  type: ColumnType;
  label: string;
  placeholder?: string;
  options?: Option[];
};

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>;
  }
>;

export type DataTableRowAction<TData> = {
  row: Row<TData>;
  type: "update" | "delete";
};

export type QueryBuilderOpts = {
  where?: SQL;
  orderBy?: SQL;
  distinct?: boolean;
  nullish?: boolean;
};
