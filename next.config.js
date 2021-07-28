const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
});

module.exports = withBundleAnalyzer(
  withPWA({
    i18n: {
      locales: ["fr-FR"],
      defaultLocale: "fr-FR"
    },
    pwa: {
      dest: "public",
      disable: process.env.NODE_ENV === "production" ? false : true,
      runtimeCaching
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: false
    }
  })
);
