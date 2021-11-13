const path = require("path");
const withPlugins = require("next-compose-plugins");
const withCustomBabelConfigFile = require("next-plugin-custom-babel-config");
const withPWA = require("next-pwa");
//const withPreact = require("next-plugin-preact");

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require("next/constants");

let plugins = [
  //[withPreact],
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
  [
    withCustomBabelConfigFile,
    {
      babelConfigFile: path.resolve("./babel.config.js")
    }
  ]
]

if (process.env.ANALYZE) {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  });
  plugins.unshift([withBundleAnalyzer])
}

const nextConfig = {
  i18n: {
    locales: ["fr-FR"],
    defaultLocale: "fr-FR"
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = withPlugins(
  plugins,
  nextConfig
);
