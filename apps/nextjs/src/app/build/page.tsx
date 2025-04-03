"use client";

import dynamic from "next/dynamic";

const DynamicPage = dynamic(() => import("./dynamic-page"), {
  ssr: false,
});

const Page = () => {
  return <DynamicPage />;
};

export default Page;
