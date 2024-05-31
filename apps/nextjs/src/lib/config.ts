export const siteConfig = {
  name: "2up",
  shortName: "2up",
  description: "Realtime multiplayer party games 🎮",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://2uphq.com",
  twitter: "@kaiyuhsu",
  routes: [""],
};
