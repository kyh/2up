"use client";

import { useState } from "react";
import Link from "next/link";
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
import { SearchIcon } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

import { accountPageLinks, dashboardPageLinks } from "@/lib/page-links";

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

  useHotkeys("cmd+k", onClick);

  return (
    <>
      <Button
        className="rounded-full"
        variant="ghost"
        size="icon"
        onClick={onClick}
      >
        <SearchIcon />
        <span className="sr-only">Search</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {dashboardPageLinks.map((link) => (
              <CommandItem
                key={link.id}
                className="group flex flex-col items-center gap-1 p-2 text-xs"
                asChild
              >
                <Link href={link.href}>
                  <link.Icon className="mr-3 !size-4" />
                  <span>{link.label}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            {accountPageLinks.map((link) => (
              <CommandItem
                key={link.id}
                className="group flex flex-col items-center gap-1 p-2 text-xs"
                asChild
              >
                <Link href={link.href}>
                  <link.Icon className="mr-3 !size-4" />
                  <span>{link.label}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
