import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="container relative grid min-h-dvh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div className="relative hidden h-full flex-col bg-muted px-8 py-4 text-white dark:border-r md:py-10 lg:flex">
      <div className="absolute inset-0 bg-zinc-900" />
      <Link className="relative z-20 flex items-center" href="/">
        Init.
      </Link>
      <div className="relative z-20 mt-auto">
        <blockquote className="space-y-2">
          <p className="text-lg">
            &ldquo;Aenean consectetur a enim ac posuere. Pellentesque vehicula
            semper blandit. Aliquam maximus ligula quis risus porta, sit amet
            pulvinar mi elementum. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.&rdquo;
          </p>
          <footer className="text-sm">Lorem Ipsum</footer>
        </blockquote>
      </div>
    </div>
    <div className="lg:p-8">{children}</div>
  </div>
);

export default Layout;
