const { CRED_USERNAME, CRED_PASSWORD } = process.env
const puppeteer = require('puppeteer');
const fs = require('fs').promises;


module.exports = (async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }); //Rodando com interface
  const page = await browser.newPage();
  // Ajustando a tela
  //await page.setViewport({width: 1200, height: 720})
  await page.goto('https://strans.codtran.ws/');
  await page.type('#Username', CRED_USERNAME);
  await page.type('#Password', CRED_PASSWORD);
  
  await Promise.all([
    page.click("button"),
    page.waitForNavigation({ waitUntil: 'load' }),
  ]);
  const cookies = await page.cookies();
  await browser.close();
  await fs.writeFile('./cookies/cookies.json', JSON.stringify(cookies, null, 2));
  return cookies
});