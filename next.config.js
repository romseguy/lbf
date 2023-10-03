const path = require("path");
//const withCustomBabelConfigFile = require("next-plugin-custom-babel-config");
const withPWA = require("next-pwa")({ dest: "public", reloadOnOnline: false });
//const withPreact = require("next-plugin-preact");
const withTwin = require('./withTwin.js')

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER
} = require("next/constants");

let plugins = [
  //withPreact,
  withTwin,
  //withPWA,
  // withCustomBabelConfigFile({
  //   babelConfigFile: path.resolve("./babel.config.js")
  // })
]

if (process.env.ANALYZE) {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  });
  plugins.unshift(withBundleAnalyzer)
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
  //         { key: "Access-Control-Allow-Origin", value: "https://beta.lebonforum.fr" },
  //         { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
  //         { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  //       ]
  //     }
  //   ]
  // },
  eslint: {
    ignoreDuringBuilds: true
  },
  i18n: {
    locales: ["fr-FR"],
    defaultLocale: "fr-FR"
  },
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true
  },
  // webpack(config, { dev, isServer }) {
  //   if (dev && !isServer) {
  //     const originalEntry = config.entry
  //     config.entry = async () => {
  //       const wdrPath = path.resolve(__dirname, './wdyr.ts')
  //       const entries = await originalEntry()

  //       if (entries['main.js'] && !entries['main.js'].includes(wdrPath)) {
  //         entries['main.js'].push(wdrPath)
  //       }
  //       return entries
  //     }
  //   }

  //   return config
  // }
};

module.exports = (phase, defaultConfig) => {
  if (phase === PHASE_PRODUCTION_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    plugins.unshift(withPWA)
  }
  const config = plugins.reduce((acc, plugin) => {
    const update = plugin(acc);
    return typeof update === "function" ? update(phase, defaultConfig) : update;
  }, { ...nextConfig });

  return config;
}

