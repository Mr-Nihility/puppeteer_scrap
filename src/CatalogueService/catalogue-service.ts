import puppeteer from 'puppeteer';

export class CatalogueService {
  public fetchProductsCatalogs = async (url: string) => {
    const browser = await puppeteer.launch({
      devtools: true,
      product: 'chrome',
    });
    try {
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(2 * 60 * 1000);
      await Promise.all([page.waitForNavigation(), page.goto(url)]);

      return await page.$$eval('.card-catalogue', (resultItems) => {
        return resultItems.map((resultItem) => {
          const url = resultItem.querySelector('a[href$=".pdf"]').href;
          const name = resultItem.querySelector('h3')?.textContent.trim();
          const dateElement = resultItem.querySelectorAll('p > time');

          return {
            url,
            name,
            start: dateElement[0].dateTime,
            end: dateElement[1].dateTime,
          };
        });
      });
    } finally {
      await browser.close();
    }
  };
}
