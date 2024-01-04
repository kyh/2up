import { cookies } from "next/headers";
import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

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

import { signOut } from "@/app/auth/actions";

export const UserNav = async () => {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return (
      <div className="flex items-center space-x-4">
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
              src={data.user.user_metadata.image ?? ""}
              alt={data.user.user_metadata.name ?? "unknown"}
            />
            <AvatarFallback>KH</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Kaiyu</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.user?.email}
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
        <DropdownMenuItem asChild>
          <form action={signOut}>
            <button>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
