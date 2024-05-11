import puppeteer from 'puppeteer-core';

const fetchItems = async () => {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(2 * 60 * 1000);
    await Promise.all([
      page.waitForNavigation(),
      page.goto('https://amazon.com'),
    ]);
  } finally {
    await browser.close();
  }
};

fetchItems();
