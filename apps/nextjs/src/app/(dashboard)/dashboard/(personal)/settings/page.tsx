import { PageHeader } from "@/components/header";
import { AppearanceForm } from "./_components/appearance-form";
import { ProfileForm } from "./_components/profile-form";

const Page = () => {
  return (
    <main className="flex flex-1 flex-col px-5">
      <PageHeader>Profile</PageHeader>
      <section className="divide-y divide-border">
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Use a permanent address where you can receive mail.
            </p>
          </div>
          <div className="md:col-span-2">
            <ProfileForm />
          </div>
        </div>
        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 py-8 md:grid-cols-3">
          <div>
            <h2 className="text-base font-light leading-7 text-primary">
              Appearance
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Select the theme for the dashboard.
            </p>
          </div>
          <div className="md:col-span-2">
            <AppearanceForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
