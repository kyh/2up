"use client";

import dynamic from "next/dynamic";

const Pacman = dynamic(() => import("./pacman"), {
  ssr: false,
});

const Page = () => {
  return <Pacman />;
};

export default Page;
