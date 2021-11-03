const path = require("path");
const withPlugins = require("next-compose-plugins");
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require("next/constants");
const withCustomBabelConfigFile = require("next-plugin-custom-babel-config");
const withPWA = require("next-pwa");
//const withPreact = require("next-plugin-preact");

let plugins = [
  [
    withPWA,
    {
      pwa: {
        dest: "public",
        runtimeCaching: require("next-pwa/cache")
      }
    },
    [PHASE_PRODUCTION_BUILD]
  ],
  //[withPreact],
  [
    withCustomBabelConfigFile,
    {
      babelConfigFile: path.resolve("./babel.config.js")
    }
  ]
]

if (process.env.NODE_ENV === "development") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
  });
  plugins.unshift([withBundleAnalyzer])
}

const nextConfig = {
  i18n: {
    locales: ["fr-FR"],
    defaultLocale: "fr-FR"
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  }
};

module.exports = withPlugins(
  plugins,
  nextConfig
);
