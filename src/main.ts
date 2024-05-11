import { CatalogueService } from './CatalogueService/catalogue-service';
import { FileManager } from './FileManager/fs-service';
import { getFileNameWithTimestamp, parseUrl } from './utils/helpers';
class Entry {
  readonly TARGET_URL = 'https://www.tus.si/#s2';

  constructor(
    private fm: FileManager,
    private catalogService: CatalogueService,
  ) {
    this.start();
  }

  private start = async () => {
    const catalogueList = await this.catalogService.fetchProductsCatalogs(
      this.TARGET_URL,
    );

    await this.fm.createFile(
      `${getFileNameWithTimestamp()}_${parseUrl(this.TARGET_URL)}.json`,
      JSON.stringify(catalogueList),
    );

    for (let i = 0; i < catalogueList.length; i++) {
      await this.fm.downLoadPdf(catalogueList[i].url);
    }
  };
}

new Entry(new FileManager(), new CatalogueService());
