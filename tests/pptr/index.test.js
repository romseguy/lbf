const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

describe("1.", () => {

  beforeAll(async () => {
    recorder = new PuppeteerScreenRecorder(page);
  });

  it("1.1.", async () => {
    await recorder.start('./tests/pptr/index.1.1.mp4');
    await page.goto('http://localhost:3004');

    await page.waitForSelector('button[aria-label="Mes feuilles"]')
    await page.click('button[aria-label="Mes feuilles"]')
    await expect(page).toClick("button", { text: "Ajouter une feuille" })
    await page.waitForNavigation()

    // /feuilles/ajouter
    await page.waitForSelector('input[name="orgName"]')
    await page.type('input[name="orgName"]', "cerisier")
    await page.click('button[type=submit]');
    await page.waitForNavigation()

    // /cerisier
    await expect(page).toClick("button", { text: "Configurer" })
    await expect(page).toClick("button", { text: "Modifier" })
    //await page.click('input[name="orgName"]', { clickCount: 3 });
    await page.type('input[name="orgName"]', "poirier")
    await page.click('button[type=submit]')

    await page.waitForNavigation()
    await recorder.stop();
    await page.screenshot({ path: 'tests/pptr/index.1.1.jpg', fullPage: true });
  })
})