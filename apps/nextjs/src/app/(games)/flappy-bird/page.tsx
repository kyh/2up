"use client";

import dynamic from "next/dynamic";

const FlappyBird = dynamic(() => import("./flappy-bird"), {
  ssr: false,
});

const Page = () => {
  return <FlappyBird />;
};

export default Page;
