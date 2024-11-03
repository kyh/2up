"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { createTeamInput } from "@init/api/team/team-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@init/ui/avatar";
import { Button } from "@init/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@init/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@init/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import { Logo } from "@init/ui/logo";
import { toast } from "@init/ui/toast";
import { cn, getInitials } from "@init/ui/utils";
import {
  CheckIcon,
  CreditCardIcon,
  HomeIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  Users2Icon,
} from "lucide-react";

import { NavLink } from "@/components/nav";
import { api } from "@/trpc/react";

export const Sidebar = () => {
  const [{ user }] = api.auth.me.useSuspenseQuery();
  const params = useParams<{ team: string | undefined }>();

  const teamSlug = params.team;
  const rootUrl = `/dashboard/${teamSlug ?? user?.user_metadata.defaultTeam}`;
  const pageLinks = [
    {
      href: rootUrl,
      label: "Tasks",
      exact: true,
      icon: HomeIcon,
    },
    {
      href: `${rootUrl}/members`,
      label: "Members",
      icon: Users2Icon,
    },
    {
      href: `${rootUrl}/settings`,
      label: "Settings",
      icon: SettingsIcon,
    },
    {
      href: `${rootUrl}/billing`,
      label: "Billing",
      icon: CreditCardIcon,
    },
  ];

  return (
    <nav className="sticky top-0 flex h-dvh w-[80px] flex-col items-center overflow-y-auto overflow-x-hidden px-4 py-[26px]">
      <div className="flex flex-col">
        <div className="flex justify-center pb-2">
          <NavLink href={rootUrl}>
            <Logo className="size-10 rounded-lg bg-muted text-primary" />
            <span className="sr-only">Init</span>
          </NavLink>
        </div>
        {pageLinks.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            exact={link.exact}
            className="group flex flex-col items-center gap-1 p-2 text-xs"
          >
            <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
              <link.icon className="size-4" />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <UserDropdown teamSlug={teamSlug} />
    </nav>
  );
};

export const UserDropdown = ({ teamSlug }: { teamSlug?: string }) => {
  const router = useRouter();
  const [{ user }] = api.auth.me.useSuspenseQuery();
  const [{ teams }] = api.team.getMyTeams.useSuspenseQuery();

  const signOut = api.auth.signOut.useMutation({
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error) => toast.error(error.message),
  });
  const createTeamAccount = api.team.createTeam.useMutation({
    onSuccess: ({ team }) => {
      toast.success("Team created successfully");
      router.push(`/dashboard/${team.slug}`);
    },
    onError: () =>
      toast.error(
        "We encountered an error creating your team. Please try again.",
      ),
  });

  const form = useForm({
    schema: createTeamInput,
    defaultValues: {
      name: "",
    },
  });

  if (!user) return null;

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger className="mt-auto">
          <Avatar className="size-9">
            {user.user_metadata.avatarUrl && (
              <AvatarImage
                src={user.user_metadata.avatarUrl as string}
                alt="Profile Picture"
              />
            )}
            <AvatarFallback>
              {getInitials(
                (user.user_metadata.displayName as string | undefined) ??
                  user.email ??
                  "",
              )}
            </AvatarFallback>
          </Avatar>
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
              <p className="text-sm font-medium leading-none">
                {user.user_metadata.displayName ?? user.email}
              </p>
              {user.user_metadata.displayName && (
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/account">Account Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Switch Teams</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {teams.map((team) => (
                  <DropdownMenuItem key={team.id} asChild>
                    <Link
                      href={`/dashboard/${team.slug}`}
                      className="inline-flex w-full items-center font-normal"
                    >
                      <Avatar className="size-4">
                        <AvatarFallback className="group-hover:bg-background">
                          {team.name ? getInitials(team.name) : ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2">{team.name}</span>
                      <CheckIcon
                        className={cn(
                          "ml-auto size-4",
                          teamSlug === team.slug ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DialogTrigger asChild>
                  <DropdownMenuItem className="flex w-full gap-2" asChild>
                    <button type="button">
                      <PlusIcon className="size-4" />
                      Create a Team
                    </button>
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button
              className="flex w-full gap-2"
              onClick={() => signOut.mutate()}
            >
              <LogOutIcon className="size-4" />
              Log out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new Team to manage your projects and members.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              createTeamAccount.mutate(data);
            })}
          >
            <div className="flex flex-col space-y-4">
              <FormField
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Team Name</FormLabel>
                      <FormControl>
                        <Input
                          required
                          minLength={2}
                          maxLength={50}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex justify-end space-x-2">
                <Button loading={createTeamAccount.isPending}>
                  Create Team
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
