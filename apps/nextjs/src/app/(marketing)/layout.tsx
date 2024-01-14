import type { Metadata } from "next";
import Link from "next/link";

import { UserNav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Template",
  description: "Unauthenticated pages.",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;

const Header = () => (
  <div className="mx-auto w-full justify-center bg-black">
    <div className="border-t-none border-gray mx-auto flex w-full max-w-7xl items-center justify-between border px-8 py-4 md:p-8">
      <div className="flex items-center justify-between text-white">
        <Link href="/" className="font-display inline-flex items-center">
          <span>Template.</span>
        </Link>
      </div>
      <nav className="ml-auto flex items-center text-sm">
        <Link
          href="/docs"
          className="px-4 py-2 text-zinc-500 transition hover:text-white"
        >
          Documentation
        </Link>
        <Link
          href="https://github.com/kyh/template"
          className="px-4 py-2 text-zinc-500 transition hover:text-white"
        >
          Github
        </Link>
        <div className="px-4">
          <UserNav />
        </div>
      </nav>
    </div>
  </div>
);

const Footer = () => (
  <footer>
    <div className="border-gray mx-auto max-w-7xl border-x border-b p-8 lg:border-b-0">
      <div>
        <span className="text-zinc-500">Template</span>
      </div>
      <div className="mt-28 grid grid-cols-1 lg:grid-cols-2">
        <p className="mt-4 text-2xl font-light text-white">
          <span className="block">If you have a project idea in mind,</span>
          <span className="block"> let's join forces and collaborate.</span>
        </p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <ul>
            <li>
              <Link
                className="text-sm text-zinc-500 transition hover:text-white"
                href="https://lexingtonthemes.com/documentation/quick-start/"
              >
                Github
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-zinc-500 transition hover:text-white"
                href="https://kyh.io"
              >
                Discord
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-zinc-500 transition hover:text-white"
                href="https://twitter.com/kaiyuhsu"
              >
                X
              </Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link
                className="text-sm text-zinc-500 transition hover:text-white"
                href="/docs"
              >
                Documentation
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-zinc-500 transition hover:text-white"
                href="/legal/terms"
              >
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link
                className="text-sm text-zinc-500 transition hover:text-white"
                href="/legal/privacy"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);
