import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NAV_ITEMS = [
  {
    label: "Join game",
    path: "/v2",
  },
  {
    label: "Discover",
    path: "/v2/discover",
  },
  {
    label: "My games",
    path: "/v2/mygames",
  },
];

type SidebarItemProps = (typeof NAV_ITEMS)[number];

const SidebarItem = ({ path, label }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === path;

  return (
    <Link
      className={`text-2.5 mb-9 ml-1 flex items-center gap-2  ${
        isActive ? "text-accent-yellow-regular" : ""
      }`}
      href={path}
    >
      <div
        className={`
    ${isActive ? "block" : "hidden"}
    `}
      >
        <img src="/illustrations/rightArrow.svg" alt="Right Arrow"></img>
      </div>
      {label}
    </Link>
  );
};

export const SideBar = () => {
  return (
    <div className="flex w-48  shrink-0 flex-col gap-4 bg-accent-gray-regular pl-12 pt-24 text-white">
      {NAV_ITEMS.map((item) => (
        <SidebarItem label={item.label} path={item.path} />
      ))}
    </div>
  );
};
