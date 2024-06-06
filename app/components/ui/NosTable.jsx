import React from "react";
import clsx from "clsx";

export const Edges = ({ type }) => {
  const spanStyles = {
    normal: "border-dark",
    dark: "border-light",
  };

  var spanClasses = spanStyles[type] || spanStyles.normal;

  return (
    <span span>
      <span
        className={clsx(
          spanClasses,
          `pointer-events-none absolute left-[0px] top-[-4px] h-[calc(100%+8px)] w-[calc(100%-0px)] border-y-4 px-3 py-2`,
        )}
      ></span>

      <span
        className={clsx(
          spanClasses,
          `pointer-events-none absolute left-[-4px] top-[0px] h-[calc(100%-0px)] w-[calc(100%+8px)] border-x-4 px-3 py-2`,
        )}
      ></span>
    </span>
  );
};

export default function Table({ type, centered, bordered, data, ...props }) {
  const typeClassMap = {
    normal: bordered ? "border-dark text-dark" : "text-dark",
    dark: bordered ? "border-light text-light" : "text-light",
  };

  var border = typeClassMap[type] || typeClassMap.normal;

  return (
    <div
      {...props}
      className={clsx(
        type === "dark" ? `bg-dark p-2` : `p-2`,
        `relative max-w-[100%] overflow-auto text-base`,
      )}
    >
      <table
        className={clsx(
          type === "dark" ? ` bg-dark` : ` bg-light`,
          `relative table-fixed border-collapse  border-0`,
        )}
      >
        {bordered &&
          (type === "dark" ? <Edges type="dark" /> : <Edges type="normal" />)}

        <thead className={clsx(centered ? `text-center` : `text-left`)}>
          <tr>
            {data.head.map((th, i) => {
              return (
                <th
                  key={i}
                  className={clsx(
                    border,
                    bordered && `border-b-4 border-r-4 last:border-r-0`,
                    `p-3 `,
                  )}
                >
                  {th}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.body.map((tr, i) => {
            return (
              <tr
                key={i}
                className={clsx(
                  border,
                  bordered && `border-b-4 last:border-b-0`,
                  `p-3 `,
                )}
              >
                {tr.map((td, j) => {
                  return (
                    <td
                      key={j}
                      className={clsx(
                        border,
                        bordered && `border-b-0 border-r-4 last:border-r-0 `,
                        `p-2 `,
                      )}
                    >
                      {td}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
