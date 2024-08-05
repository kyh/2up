import { PageHeader } from "@/components/header";

const Page = async () => {
  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader showSearch showNotifications>
        Welcome back
      </PageHeader>
    </main>
  );
};

export default Page;
