module.exports = function (api) {
  const isServer = api.caller((caller) => caller?.isServer);
  const isCallerDevelopment = api.caller((caller) => caller?.isDev);

  const presets = [["next/babel"]];

  const env = {
    production: {
      plugins: []
    },
    development: {
      compact: false
    }
  };

  const plugins = [];

  return { presets, env, plugins };
};
