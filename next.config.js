const path = require("path");
const withPlugins = require("next-compose-plugins");
const withCustomBabelConfigFile = require("next-plugin-custom-babel-config");
const withPWA = require("next-pwa");
//const withPreact = require("next-plugin-preact");
//const withTwin = require('./withTwin.js')

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require("next/constants");

let plugins = [
  //[withPreact],
  //[withTwin],
  [
    withPWA,
    {
      pwa: {
        dest: "public"
        //runtimeCaching: require("next-pwa/cache")
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
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: "/api/:path*",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: process.env.NEXT_PUBLIC_URL },
  //         { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ]
  //     }
  //   ]
  // },
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
