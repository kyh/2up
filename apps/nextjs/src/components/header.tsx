"use client";

import { useEffect, useState } from "react";
import { Button } from "@init/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@init/ui/command";
import {
  CardStackMinusIcon,
  ChatBubbleIcon,
  DashboardIcon,
  MagnifyingGlassIcon,
  MixIcon,
  PersonIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

type PageHeaderProps = {
  children: React.ReactNode;
  showSearch?: boolean;
};

export const PageHeader = ({
  children,
  showSearch = false,
}: PageHeaderProps) => {
  return (
    <header className="flex h-20 items-center justify-between md:h-24">
      <h1 className="text-xl">{children}</h1>
      <div>{showSearch && <SearchButton />}</div>
    </header>
  );
};

const SearchButton = () => {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        className="rounded-full"
        variant="ghost"
        size="icon"
        onClick={onClick}
      >
        <MagnifyingGlassIcon />
        <span className="sr-only">Search</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <DashboardIcon className="mr-3 !size-4" />
              <span>CRUD</span>
            </CommandItem>
            <CommandItem>
              <ChatBubbleIcon className="mr-3 !size-4" />
              <span>Chat</span>
            </CommandItem>
            <CommandItem>
              <QuestionMarkCircledIcon className="mr-3 !size-4" />
              <span>Docs</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <PersonIcon className="mr-3 !size-4" />
              <span>Account</span>
            </CommandItem>
            <CommandItem>
              <CardStackMinusIcon className="mr-3 !size-4" />
              <span>Billing</span>
            </CommandItem>
            <CommandItem>
              <MixIcon className="mr-3 !size-4" />
              <span>Team</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
