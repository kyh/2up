import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export const SideBar = () => {
  const router = useRouter();

  console.log(router.pathname);

  return (
    <div className="w-48 bg-accent-gray-regular  text-white flex flex-col gap-4 shrink-0 pl-12 pt-24">
      <Link
        className={`ml-1 text-2.5 mb-9 flex items-center gap-2 ${
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
        className={`ml-1 text-2.5 mb-9 flex items-center gap-2 ${
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
        className={`ml-1 text-2.5 mb-9 flex items-center gap-2  ${
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
