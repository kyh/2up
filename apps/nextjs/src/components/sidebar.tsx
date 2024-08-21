"use client";

import { createElement, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createTeamAccountInput } from "@init/api/account/team-account-schema";
import { Avatar, AvatarFallback, AvatarImage } from "@init/ui/avatar";
import { Button } from "@init/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  FormDescription,
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
  CheckCircleIcon,
  CreditCardIcon,
  HomeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
  Users2Icon,
  UsersIcon,
} from "lucide-react";

import { api } from "@/trpc/react";
import { NavLink } from "./nav";

type PageLink = {
  id: string;
  href: string;
  label: string;
  exact?: boolean;
};

const icons = {
  home: HomeIcon,
  accounts: Users2Icon,
  billing: CreditCardIcon,
  settings: SettingsIcon,
  crud: LayoutDashboardIcon,
  members: UsersIcon,
};

export const Sidebar = ({
  homeLink,
  pageLinks,
  currentAccountSlug,
}: {
  homeLink: string;
  pageLinks: PageLink[];
  currentAccountSlug?: string;
}) => {
  const [{ user, account, accounts }] =
    api.account.userWorkspace.useSuspenseQuery();
  const signOut = api.auth.signOut.useMutation();
  const [isCreateTeamAccountDialogOpen, setIsCreateTeamAccountDialogOpen] =
    useState(false);

  const handleSignOut = async () => {
    await signOut.mutateAsync();
  };

  return (
    <nav className="sticky top-0 flex h-dvh w-[80px] flex-col items-center overflow-y-auto overflow-x-hidden px-4 py-[26px]">
      <div className="flex flex-col">
        <div className="flex justify-center pb-2">
          <NavLink href={homeLink}>
            <Logo className="size-10 rounded-lg bg-muted text-primary" />
            <span className="sr-only">Init</span>
          </NavLink>
        </div>
        {pageLinks.map((link) => (
          <NavLink
            key={link.id}
            href={link.href}
            exact={link.exact}
            className="group flex flex-col items-center gap-1 p-2 text-xs"
          >
            <span className="flex size-9 items-center justify-center rounded-lg transition group-hover:bg-secondary group-data-[state=active]:bg-secondary">
              {createElement(
                icons[link.id as keyof typeof icons] ?? icons.home,
                {
                  className: "size-4",
                },
              )}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="mt-auto">
          <Avatar className="size-9">
            <AvatarImage
              src={account.pictureUrl ?? ""}
              alt={account.name ?? ""}
            />
            <AvatarFallback>{getInitials(account.name ?? "")}</AvatarFallback>
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
              <p className="text-sm font-medium leading-none">{account.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Switch Teams</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard"
                    className="inline-flex w-full items-center font-normal"
                  >
                    <UserIcon className="size-4" />
                    <span className="ml-2">Personal</span>
                    <CheckCircleIcon
                      className={cn(
                        "ml-auto size-4",
                        !currentAccountSlug ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </Link>
                </DropdownMenuItem>
                {accounts.map((account) => (
                  <DropdownMenuItem key={account.id} asChild>
                    <Link
                      href={`/dashboard/${account.slug}`}
                      className="inline-flex w-full items-center font-normal"
                    >
                      <Avatar className="size-4">
                        <AvatarFallback className="group-hover:bg-background">
                          {account.name ? getInitials(account.name) : ""}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2">{account.name}</span>
                      <CheckCircleIcon
                        className={cn(
                          "ml-auto size-4",
                          currentAccountSlug === account.slug
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  className="flex w-full gap-2"
                  onSelect={() => setIsCreateTeamAccountDialogOpen(true)}
                  asChild
                >
                  <button type="button">
                    <PlusIcon className="size-4" />
                    Create a Team
                  </button>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button className="flex w-full gap-2" onClick={handleSignOut}>
              <LogOutIcon className="size-4" />
              Log out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateTeamAccountDialog
        open={isCreateTeamAccountDialogOpen}
        onOpenChange={setIsCreateTeamAccountDialogOpen}
      />
    </nav>
  );
};

const CreateTeamAccountDialog = ({
  ...props
}: React.ComponentPropsWithoutRef<typeof Dialog>) => {
  const router = useRouter();

  const createTeamAccount = api.account.createTeamAccount.useMutation({
    onSuccess: (res) => {
      toast.success("Team created successfully");
      router.push(`/dashboard/${res.slug}`);
    },
    onError: () =>
      toast.error(
        "We encountered an error creating your team. Please try again.",
      ),
  });

  const form = useForm({
    schema: createTeamAccountInput,
    defaultValues: {
      name: "",
    },
  });

  return (
    <Dialog {...props}>
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
                      <FormDescription>
                        Your team name should be unique and descriptive
                      </FormDescription>
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
