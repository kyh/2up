import { Suspense } from "react";

import { AuthShowcase } from "@/components/auth-showcase";
import { JoinWaitlistForm, WaitlistList } from "@/components/waitlist";

export const runtime = "edge";

const HomePage = () => {
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Example
        </h1>
        <AuthShowcase />
        <JoinWaitlistForm />
        <div className="h-[40vh] w-full max-w-2xl overflow-y-scroll">
          <Suspense fallback={null}>
            <WaitlistList />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
