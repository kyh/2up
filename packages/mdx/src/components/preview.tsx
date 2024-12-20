import type React from "react";

import styles from "./preview.module.css";

export const Preview = ({
  children,
  codeblock,
}: React.HTMLAttributes<HTMLDivElement> & { codeblock?: string }) => (
  <span data-with-codeblock={codeblock} className={styles.preview}>
    {children}
  </span>
);
