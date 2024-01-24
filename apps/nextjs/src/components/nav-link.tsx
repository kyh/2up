"use client";

import type { LinkProps } from "next/link";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@init/ui/utils";

type NavLinkProps = LinkProps & {
  href: string;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  children?: React.ReactNode;
};

export const NavLink = ({
  href,
  exact,
  className,
  activeClassName,
  children,
  ...props
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(className, isActive && activeClassName)}
      data-state={isActive ? "active" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
};
