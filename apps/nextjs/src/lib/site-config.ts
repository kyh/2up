export const siteConfig = {
  name: "VibedGames",
  shortName: "VibedGames",
  description: "Games made with vibes 🎮",
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://vibedgames.com",
  twitter: "@kaiyuhsu",
};
