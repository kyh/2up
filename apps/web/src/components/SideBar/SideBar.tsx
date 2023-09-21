import Link from "next/link";
import React from "react";

export const SideBar = () => {
  return (
    <div className="w-[192px] bg-accent-gray-regular  text-white flex flex-col gap-4 shrink-0 pl-12 pt-24">
      <Link className="ml-1 text-[10px] mb-[36px]" href="/packs">
        Join game
      </Link>
      <Link className="ml-1 text-[10px] mb-[36px]" href="/packs">
        Discover
      </Link>
      <Link className="ml-1 text-[10px] mb-[36px]" href="/packs">
        My games
      </Link>
    </div>
  );
};
