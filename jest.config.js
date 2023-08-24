// TODO: yarn add next@12
// const nextJest = require("next/jest");
// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: "./",
// });
// module.exports = createJestConfig(customJestConfig);

const babelConfigEmotion = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ],
  plugins: [
    require.resolve('babel-plugin-macros'),
    require.resolve('@emotion/babel-plugin'),
  ],
}

const customJestConfig = {
  globalSetup: './tests/setupEnv.js',
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  setupFilesAfterEnv: ['./jest.setup.js'],
  //setupFiles: ['<rootDir>/tests/utils.js'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', babelConfigEmotion],
  },
};

module.exports = customJestConfig
