export const siteConfig = {
  name: "Init",
  shortName: "Init",
  description:
    "A comprehensive boilerplate to build, launch, and scale your next project",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://init.kyh.io",
  twitter: "@kaiyuhsu",
  routes: [""],
};
