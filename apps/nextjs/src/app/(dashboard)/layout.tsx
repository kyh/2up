import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@init/ui/avatar";
import { Button } from "@init/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import { Logo } from "@init/ui/logo";
import {
  ChatBubbleIcon,
  DashboardIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

import { NavLink } from "@/components/nav";

export const metadata: Metadata = {
  title: "Dashboard",
};

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;

const navLinks = [
  { id: "crud", href: "/dashboard", label: "CRUD", Icon: DashboardIcon },
  { id: "chat", href: "/chat", label: "Chat", Icon: ChatBubbleIcon },
  { id: "docs", href: "/docs", label: "Docs", Icon: QuestionMarkCircledIcon },
] as const;

const userDropdownLinks = [
  { id: "account", href: "/account", label: "Account" },
  { id: "billing", href: "/account/billing", label: "Billing" },
  { id: "team", href: "/account/team", label: "Team" },
] as const;

const Sidebar = ({ user }: { user?: any }) => {
  const userImage = user.user_metadata.image ?? "";
  const userName = user.user_metadata.name ?? "unknown";

  return (
    <nav className="sticky top-0 flex h-dvh w-[80px] flex-col items-center overflow-y-auto overflow-x-hidden px-4 py-[26px]">
      <div className="flex flex-col">
        <Link href="/dashboard" className="flex justify-center pb-2">
          <Logo
            width={40}
            height={40}
            className="rounded-lg bg-muted text-primary"
          />
          <span className="sr-only">Init</span>
        </Link>
        {navLinks.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            className="group flex flex-col items-center gap-1 p-2 text-xs"
          >
            <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
              <link.Icon width={16} height={16} />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative mt-auto h-8 w-8 rounded-full"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback>KH</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          forceMount
          alignOffset={8}
          sideOffset={8}
          collisionPadding={8}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {userDropdownLinks.map((link) => (
              <DropdownMenuItem key={link.id} asChild>
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <form>
            <DropdownMenuItem className="w-full" asChild>
              <button>
                Log out
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};
