"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { buttonVariants } from "./button";
import { cn } from "./utils";

type Tab = {
  id: string;
  title: string;
  icon: LucideIcon;
  type?: never;
};

type Separator = {
  type: "separator";
  id?: never;
  title?: never;
  icon?: never;
};

type TabItem = Tab | Separator;

type ExpandedTabsProps = {
  tabs: TabItem[];
  selected?: string;
  setSelected?: (selected: string) => void;
  className?: string;
};

const animationVariants = {
  initial: {
    gap: 0,
    paddingLeft: "4px",
    paddingRight: "4px",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? "4px" : 0,
    paddingLeft: isSelected ? "8px" : "4px",
    paddingRight: isSelected ? "8px" : "4px",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = {
  delay: 0.1,
  type: "spring" as const,
  bounce: 0,
  duration: 0.6,
};

export const ExpandTabs = ({
  tabs,
  className,
  selected,
  setSelected,
}: ExpandedTabsProps) => {
  return (
    <div className={cn("flex gap-2", className)}>
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return (
            <div
              className="bg-border h-[24px] w-[1.2px]"
              aria-hidden="true"
              key={`separator-${index}`}
            />
          );
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.id}
            variants={animationVariants}
            initial={false}
            animate="animate"
            custom={selected === tab.id}
            onClick={() => setSelected?.(tab.id)}
            transition={transition}
            className={buttonVariants({
              className: "h-5 w-auto p-0",
              variant: selected === tab.id ? "secondary" : "ghost",
              size: "icon",
            })}
          >
            <Icon size={12} />
            <AnimatePresence initial={false}>
              {selected === tab.id && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden text-xs"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
};
