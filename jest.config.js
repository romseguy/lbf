// const nextJest = require("next/jest");
// const createJestConfig = nextJest({
//   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
//   dir: "./",
// });

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
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  //setupFiles: ['<rootDir>/tests/utils.js'],
  testEnvironment: 'jest-environment-jsdom',
  globalSetup: '<rootDir>/tests/setupEnv.js',
  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest', babelConfigEmotion],
  },
};

//module.exports = createJestConfig(customJestConfig);
module.exports = customJestConfig
