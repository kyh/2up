"use client";

import dynamic from "next/dynamic";

const SpaceInvaders = dynamic(() => import("./space-invaders"), {
  ssr: false,
});

const Page = () => {
  return <SpaceInvaders />;
};

export default Page;
