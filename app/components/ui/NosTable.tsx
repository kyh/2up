import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";

import Borders from "./Borders";

const tableContainerStyles = cva(
  "relative max-w-[100%] overflow-auto p-2 text-base",
  {
    variants: {
      variant: {
        normal: "bg-light",
        dark: "bg-dark",
      },
    },
    defaultVariants: {
      variant: "normal",
    },
  },
);

const tableStyles = cva("relative table-fixed border-collapse border-0", {
  variants: {
    variant: {
      normal: "bg-light",
      dark: "bg-dark",
    },
  },
  defaultVariants: {
    variant: "normal",
  },
});

const tableCellStyles = cva("h-10", {
  variants: {
    variant: {
      normal: "text-dark",
      dark: "text-light",
    },
    bordered: {
      true: "border-b-4 border-r-4 border-dark last:border-r-0",
      false: "",
    },
    centered: {
      true: "text-center",
      false: "text-left",
    },
  },
  compoundVariants: [
    { variant: "dark", bordered: true, className: "border-light" },
  ],
  defaultVariants: {
    variant: "normal",
    bordered: false,
    centered: false,
  },
});

export interface TableData {
  head: string[];
  body: string[][];
}

type TableProps = VariantProps<typeof tableCellStyles> &
  React.HTMLAttributes<HTMLDivElement> & {
    data: TableData;
  };

export const Table = ({
  variant,
  data,
  bordered,
  centered,
  ...props
}: TableProps) => {
  const tableContainerClasses = tableContainerStyles({ variant });
  const tableClasses = tableStyles({ variant });
  const tableCellClasses = tableCellStyles({ variant, bordered, centered });

  return (
    <div {...props} className={tableContainerClasses}>
      <table className={tableClasses}>
        {bordered && (
          <Borders variant={variant === "dark" ? "light" : "normal"} />
        )}
        <thead className={clsx(tableCellClasses)}>
          <tr>
            {data.head.map((th, i) => (
              <th key={i} className={clsx("p-3", tableCellClasses)}>
                {th}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.body.map((tr, i) => (
            <tr key={i} className={clsx("p-3", tableCellClasses)}>
              {tr.map((td, j) => (
                <td key={j} className={clsx("p-2", tableCellClasses)}>
                  {td}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
