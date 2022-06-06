export const isServer = () => typeof window === "undefined";

if (!isServer() && process.env.NODE_ENV === "production") {
  const CleanConsole = require("@eaboy/clean-console");
  CleanConsole.init({
    initialMessages: [
      { message: `Bienvenue sur ${process.env.NEXT_PUBLIC_SHORT_URL}` }
    ],
    debugLocalStoregeKey: "allowConsole"
  });
}
