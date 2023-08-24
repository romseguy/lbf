const PORT = 3004;

module.exports = {
  launch: {
    headless: true,
    slowMo: 0,
    devtools: false
  },
  browserContext: process.env.INCOGNITO ? 'incognito' : 'default',
  server: {
    //command: `yarn run dev --port ${PORT}`,
    port: PORT,
    //launchTimeout: 60000,
  },
};