export const Properties = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6">
    <ul
      role="list"
      className="divide-border m-0 max-w-[calc(theme(maxWidth.lg)-theme(spacing.8))] list-none divide-y p-0 text-sm"
    >
      {children}
    </ul>
  </div>
);

export const Property = ({
  name,
  children,
  type,
}: {
  name: string;
  children: React.ReactNode;
  type?: string;
}) => (
  <li className="m-0 px-0 py-4 first:pt-0 last:pb-0">
    <dl className="m-0 flex flex-wrap items-center gap-x-3 gap-y-2">
      <dt className="sr-only">Name</dt>
      <dd>
        <code>{name}</code>
      </dd>
      {type && (
        <>
          <dt className="sr-only">Type</dt>
          <dd className="text-muted-foreground font-mono text-xs">{type}</dd>
        </>
      )}
      <dt className="sr-only">Description</dt>
      <dd className="w-full flex-none [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {children}
      </dd>
    </dl>
  </li>
);
