import { SettingsForm } from "./settings-form";

// export const runtime = "edge";

const Page = async () => {
  return (
    <section className="mt-5 max-w-md">
      <SettingsForm />
    </section>
  );
};

export default Page;
