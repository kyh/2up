import Link from "next/link";

import { auth, signOut } from "@acme/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

export const UserNav = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex items-center space-x-4 text-sm">
        <Link href="/auth/signup">Sign Up</Link>
        <Link href="/auth/login">Log In</Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={session.user?.image ?? ""}
              alt={session.user?.name ?? "unknown"}
            />
            <AvatarFallback>{session.user?.name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <DropdownMenuItem className="w-full" asChild>
            <button>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
