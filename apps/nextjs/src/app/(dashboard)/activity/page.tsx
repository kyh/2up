// export const runtime = "edge";

import { PageHeader } from "@/components/header";

const Page = async () => {
  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Activity</PageHeader>
    </main>
  );
};

export default Page;
