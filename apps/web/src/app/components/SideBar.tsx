import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const SideBar = () => {
  const router = useRouter();

  return (
    <div className="flex w-48  shrink-0 flex-col gap-4 bg-accent-gray-regular pl-12 pt-24 text-white">
      <Link
        className={`text-2.5 mb-9 ml-1 flex items-center gap-2 ${
          router.pathname === "/v2" ? "text-accent-yellow-regular" : ""
        }`}
        href="/v2"
      >
        <div className={router.pathname === "/v2" ? "block" : "hidden"}>
          <img src="/illustrations/rightArrow.svg" alt="Right Arrow"></img>
        </div>
        Join game
      </Link>
      <Link
        className={`text-2.5 mb-9 ml-1 flex items-center gap-2 ${
          router.pathname === "/v2/discover" ? "text-accent-yellow-regular" : ""
        }`}
        href="/v2/discover"
      >
        <div
          className={router.pathname === "/v2/discover" ? "block" : "hidden"}
        >
          <img src="/illustrations/rightArrow.svg" alt="Right Arrow"></img>
        </div>
        Discover
      </Link>
      <Link
        className={`text-2.5 mb-9 ml-1 flex items-center gap-2  ${
          router.pathname === "/v2/mygames" ? "text-accent-yellow-regular" : ""
        }`}
        href="/v2/mygames"
      >
        <div
          className={`
          ${router.pathname === "/v2/mygames" ? "block" : "hidden"}
          `}
        >
          <img src="/illustrations/rightArrow.svg" alt="Right Arrow"></img>
        </div>
        My games
      </Link>
    </div>
  );
};
