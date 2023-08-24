const customJestConfig = {
  preset: 'jest-puppeteer',
  //"setupFilesAfterEnv": ["./jest.setup.js"],
  //"setupFilesAfterEnv": ["expect-puppeteer", "./jest.setup.js"]
  // transform: {
  //   '^.+\\.(js|jsx|ts|tsx|mjs)$': ['babel-jest'],
  // },
  testTimeout: 60000 * 5
}

module.exports = customJestConfig