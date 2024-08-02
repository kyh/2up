import Link from "next/link";

export const Footer = () => (
  <footer>
    <div className="mx-auto max-w-7xl border-x border-b border-border p-8 lg:border-b-0">
      <div className="text-muted-foreground">Init.</div>
      <div className="mt-28 grid grid-cols-1 lg:grid-cols-2">
        <p className="mt-4 text-xl font-light text-secondary-foreground">
          Accelerate building modern applications
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <ul>
            <li>
              <Link
                className="text-sm text-muted-foreground transition hover:text-secondary-foreground"
                href="https://github.com/kyh/init"
                target="_blank"
              >
                Github
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-muted-foreground transition hover:text-secondary-foreground"
                href="https://discord.gg/x2xDwExFFv"
                target="_blank"
              >
                Discord
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-muted-foreground transition hover:text-secondary-foreground"
                href="https://twitter.com/kaiyuhsu"
                target="_blank"
              >
                X
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link
                className="text-sm text-muted-foreground transition hover:text-secondary-foreground"
                href="/docs"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-muted-foreground transition hover:text-secondary-foreground"
                href="https://github.com/kyh/init/blob/main/LICENSE"
                target="_blank"
              >
                Licensing
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
