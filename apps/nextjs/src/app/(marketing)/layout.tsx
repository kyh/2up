import Link from "next/link";
import { buttonVariants } from "@init/ui/button";
import { cn } from "@init/ui/utils";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header user={null} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

const Header = ({ user }: { user: any | null }) => (
  <div className="mx-auto w-full justify-center">
    <div className="border-t-none mx-auto flex w-full max-w-7xl items-center justify-between border border-border px-8 py-4 md:p-8">
      <div className="flex items-center justify-between text-secondary-foreground">
        <Link className="font-display inline-flex items-center" href="/">
          Init.
        </Link>
      </div>
      <nav className="ml-auto flex items-center text-sm">
        <Link
          className="px-4 py-2 text-muted-foreground transition hover:text-secondary-foreground"
          href="/docs"
        >
          Documentation
        </Link>
        <Link
          className="px-4 py-2 text-muted-foreground transition hover:text-secondary-foreground"
          href="https://github.com/kyh/init"
          target="_blank"
        >
          Github
        </Link>
        {user ? (
          <Link
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "sm",
              }),
              "ml-4 rounded-full px-5",
            )}
            href="/dashboard"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "sm",
              }),
              "ml-4 rounded-full px-5",
            )}
            href="/auth/sign-in"
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  </div>
);

const Footer = () => (
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
