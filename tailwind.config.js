var paths = ["./src/pages/**/*.tsx", "./src/features/**/*.tsx"];

module.exports = {
  purge: {
    layers: ["base", "components", "utilities"],
    content: paths
  },
  // purge: paths,
  theme: {
    extend: {}
  },
  variants: {},
  plugins: []
};
