import Link from "next/link";
import clsx from "clsx";

import { Feedback } from "./components/feedback";

export { Code as code, Pre as pre } from "./components/code";
export { Properties, Property } from "./components/properties";
export { Note } from "./components/note";

export const a = Link;

export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    <article className="prose prose-zinc dark:prose-invert">{children}</article>
    <footer className="mt-16">
      <Feedback />
    </footer>
  </>
);

export const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 items-start gap-x-16 gap-y-10 xl:max-w-none xl:grid-cols-2">
    {children}
  </div>
);

export const Col = ({
  children,
  sticky = false,
}: {
  children: React.ReactNode;
  sticky?: boolean;
}) => (
  <div
    className={clsx(
      "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
      sticky && "xl:sticky xl:top-24",
    )}
  >
    {children}
  </div>
);
