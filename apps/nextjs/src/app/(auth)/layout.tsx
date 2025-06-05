import Link from "next/link";
import { Logo } from "@repo/ui/logo";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => (
  <div className="bg-background relative grid min-h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div className="bg-muted relative hidden h-full flex-col px-8 py-4 text-white md:py-10 lg:flex dark:border-r">
      <div className="absolute inset-0 bg-zinc-900" />
      <Link className="relative z-20 flex items-center" href="/">
        <Logo className="size-8" />
        <span className="sr-only">Vibedgames</span>
      </Link>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;Here's where I'd put a quote by one of my users. But I have
            none yet so I'm just writing the quote myself.&rdquo;
          </p>
          <footer className="text-sm">Kaiyu Hsu</footer>
        </blockquote>
      </div>
    </div>
    <div className="lg:p-8">{props.children}</div>
  </div>
);

export default Layout;
