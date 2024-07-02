import { redirect } from "next/navigation";
import KeystaticAdmin from "@init/cms/keystatic-admin";

export default function Layout() {
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  return <KeystaticAdmin />;
}
