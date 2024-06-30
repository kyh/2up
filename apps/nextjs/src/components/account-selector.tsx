"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@init/ui/avatar";
import { Button } from "@init/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@init/ui/command";
import { If } from "@init/ui/if";
import { Popover, PopoverContent, PopoverTrigger } from "@init/ui/popover";
import { Separator } from "@init/ui/separator";
import { cn } from "@init/ui/utils";
import {
  ArrowUpDownIcon,
  CircleCheckIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";

import { api } from "@/trpc/react";
import { CreateTeamAccountDialog } from "./create-team-account-dialog";

type AccountSelectorProps = {
  accounts: {
    label: string | null;
    value: string | null;
    image?: string | null;
  }[];

  features: {
    enableTeamCreation: boolean;
  };

  userId: string;
  selectedAccount?: string;
  collapsed?: boolean;
  className?: string;

  onAccountChange: (value: string | undefined) => void;
};

const PERSONAL_ACCOUNT_SLUG = "personal";

export const AccountSelector = ({
  accounts,
  selectedAccount,
  onAccountChange,
  userId,
  className,
  features = {
    enableTeamCreation: true,
  },
  collapsed = false,
}: React.PropsWithChildren<AccountSelectorProps>) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState<boolean>(false);

  const [value, setValue] = useState<string>(
    selectedAccount ?? PERSONAL_ACCOUNT_SLUG,
  );

  const { data: personalData } = api.account.personalAccount.useQuery({
    id: userId,
  });

  useEffect(() => {
    setValue(selectedAccount ?? PERSONAL_ACCOUNT_SLUG);
  }, [selectedAccount]);

  const Icon = (props: { item: string }) => {
    return (
      <CircleCheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          value === props.item ? "opacity-100" : "opacity-0",
        )}
      />
    );
  };

  const selected = accounts.find((account) => account.value === value);
  const pictureUrl = personalData?.picture_url;

  const PersonalAccountAvatar = () =>
    pictureUrl ? (
      <UserAvatar pictureUrl={pictureUrl} />
    ) : (
      <UserIcon className="h-4 min-h-4 w-4 min-w-4" />
    );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size={collapsed ? "icon" : "md"}
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "group w-auto min-w-0 max-w-fit px-2 dark:shadow-primary/10",
              {
                "justify-start": !collapsed,
                "justify-center": collapsed,
              },
              className,
            )}
          >
            <If
              condition={selected}
              fallback={
                <span className="flex max-w-full items-center space-x-2">
                  <PersonalAccountAvatar />

                  <span
                    className={cn("truncate", {
                      hidden: collapsed,
                    })}
                  >
                    Personal Account
                  </span>
                </span>
              }
            >
              {(account) => (
                <span className="flex max-w-full items-center space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={account.image ?? undefined} />

                    <AvatarFallback className="group-hover:bg-background">
                      {account.label ? account.label[0] : ""}
                    </AvatarFallback>
                  </Avatar>

                  <span
                    className={cn("truncate", {
                      hidden: collapsed,
                    })}
                  >
                    {account.label}
                  </span>
                </span>
              )}
            </If>

            <ArrowUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" collisionPadding={20}>
          <Command>
            <CommandInput placeholder="Search Account..." className="h-9" />

            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => onAccountChange(undefined)}
                  value={PERSONAL_ACCOUNT_SLUG}
                >
                  <PersonalAccountAvatar />

                  <span className="ml-2">Personal Account</span>

                  <Icon item={PERSONAL_ACCOUNT_SLUG} />
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <If condition={accounts.length > 0}>
                <CommandGroup heading={`Your Teams (${accounts.length})`}>
                  {(accounts ?? []).map((account) => (
                    <CommandItem
                      data-name={account.label}
                      data-slug={account.value}
                      className={cn(
                        "group my-1 flex justify-between transition-colors",
                        {
                          ["bg-muted"]: value === account.value,
                        },
                      )}
                      key={account.value}
                      value={account.value ?? ""}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);

                        if (onAccountChange) {
                          onAccountChange(currentValue);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <Avatar className="mr-2 h-5 w-5">
                          <AvatarImage src={account.image ?? undefined} />

                          <AvatarFallback
                            className={cn({
                              ["bg-background"]: value === account.value,
                              ["group-hover:bg-background"]:
                                value !== account.value,
                            })}
                          >
                            {account.label ? account.label[0] : ""}
                          </AvatarFallback>
                        </Avatar>

                        <span className="mr-2 max-w-[165px] truncate">
                          {account.label}
                        </span>
                      </div>

                      <Icon item={account.value ?? ""} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </If>
            </CommandList>
          </Command>

          <Separator />

          <If condition={features.enableTeamCreation}>
            <div className="p-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm font-normal"
                onClick={() => {
                  setIsCreatingAccount(true);
                  setOpen(false);
                }}
              >
                <PlusIcon className="mr-3 h-4 w-4" />

                <span>Create a Team</span>
              </Button>
            </div>
          </If>
        </PopoverContent>
      </Popover>

      <If condition={features.enableTeamCreation}>
        <CreateTeamAccountDialog
          isOpen={isCreatingAccount}
          setIsOpen={setIsCreatingAccount}
        />
      </If>
    </>
  );
};

const UserAvatar = (props: { pictureUrl?: string }) => (
  <Avatar className="h-6 w-6">
    <AvatarImage src={props.pictureUrl} />
  </Avatar>
);
